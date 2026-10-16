import XCTest
import Darwin

final class FluiValidacao: XCTestCase {
    let app=XCUIApplication(bundleIdentifier:"host.exp.Exponent")
    let higi="Higienópolis Prime Charge", vila="Flui Vila Mariana Lins"
    func botao(_ nome:String)->XCUIElement {app.buttons.matching(NSPredicate(format:"label == %@",nome)).firstMatch}
    func texto(_ nome:String)->XCUIElement {app.staticTexts.matching(NSPredicate(format:"label == %@",nome)).firstMatch}
    func chip(_ nome:String)->XCUIElement {app.buttons.matching(NSPredicate(format:"label == %@ OR label == %@",nome,nome+", selecionado")).firstMatch}
    func evidencia(_ nome:String){
        print("FLUI_EVIDENCIA \(nome)\n\(app.debugDescription)");fflush(stdout)
        let a=XCTAttachment(screenshot:app.screenshot());a.name=nome;a.lifetime = .keepAlways;add(a)
    }
    func centro(_ nome:String)->CGPoint {let f=botao(nome).frame;return CGPoint(x:f.midX,y:f.midY)}
    func distancia(_ a:CGPoint,_ b:CGPoint)->CGFloat {hypot(a.x-b.x,a.y-b.y)}
    func abrirFiltros(){botao("Abrir busca e filtros").tap();XCTAssertTrue(botao("Limpar busca e filtros").waitForExistence(timeout:8))}
    func aplicar(){botao("Ver pontos encontrados no mapa").tap();XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:10))}
    func selecionar(_ nome:String){
        let c=chip(nome)
        for _ in 0..<5 {if c.isHittable {break};app.scrollViews.firstMatch.swipeUp()}
        XCTAssertTrue(c.isHittable,"Critério não acessível: \(nome)")
        if !c.isSelected {c.tap()};XCTAssertTrue(c.isSelected,"Critério não selecionado: \(nome)")
        print("FLUI_FILTRO \(nome) selecionado=\(c.isSelected)");fflush(stdout)
    }
    func buscarSincronizado(_ valor:String){
        let campo=app.textFields.matching(NSPredicate(format:"label == %@","Buscar no mapa")).firstMatch
        let inicial=campo.value as? String ?? ""
        XCTAssertTrue(inicial.isEmpty || inicial.hasPrefix("Buscar endereço"),"Busca deveria estar vazia: \(inicial)")
        campo.tap();Thread.sleep(forTimeInterval:0.4)
        var prefixo=""
        for c in valor {
            prefixo.append(c);let esperado=prefixo
            campo.typeText(String(c))
            let e=XCTNSPredicateExpectation(predicate:NSPredicate{_,_ in (campo.value as? String)==esperado},object:nil)
            XCTAssertEqual(XCTWaiter.wait(for:[e],timeout:3),.completed,"Entrada perdeu caracteres; esperado=\(esperado), real=\(String(reflecting:campo.value))")
        }
        campo.typeText("\n")
        print("FLUI_BUSCA_CONFIRMADA \(String(reflecting:campo.value))");fflush(stdout)
        XCTAssertEqual(campo.value as? String,valor)
    }
    func rapido(){
        botao("Abrir assistente Flui IA").tap()
        let b=botao("Quero carregar rápido")
        if b.waitForExistence(timeout:5){b.tap()}
        XCTAssertTrue(botao("Ver \(vila) no mapa").waitForExistence(timeout:12),app.debugDescription)
    }
    override func setUpWithError() throws {
        continueAfterFailure=false;app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout:3){
            let recente=botao("flui-charge-map");XCTAssertTrue(recente.waitForExistence(timeout:8),app.debugDescription);recente.tap()
        }
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
    }
    @MainActor func test01BuscaSincronizadaEReposicionamentoPorFiltro() throws {
        abrirFiltros();botao("Limpar busca e filtros").tap();aplicar()
        botao("Centralizar localização na FIAP").tap();Thread.sleep(forTimeInterval:1)
        XCTAssertFalse(botao(higi).exists)
        buscarSincronizado(higi)
        XCTAssertTrue(botao(higi).waitForExistence(timeout:10),app.debugDescription)
        evidencia("Busca com texto completo reposiciona para Higienópolis")
        let minimizar=botao("Minimizar opções demonstrativas para ver o mapa inteiro");if minimizar.exists {minimizar.tap()}
        let abrir=botao("Mostrar atalhos de filtro");if abrir.exists {abrir.tap()}
        app.coordinate(withNormalizedOffset:CGVector(dx:0.28,dy:0.48)).press(forDuration:0.3,thenDragTo:app.coordinate(withNormalizedOffset:CGVector(dx:0.36,dy:0.52)))
        Thread.sleep(forTimeInterval:1)
        let antes=centro(higi)
        let ccs=app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@","CCS2")).firstMatch;ccs.tap()
        XCTAssertTrue(ccs.isSelected);Thread.sleep(forTimeInterval:1)
        let depois=centro(higi)
        print("FLUI_REPOSICIONAMENTO_FILTRO antes=\(antes) depois=\(depois)")
        XCTAssertGreaterThan(distancia(antes,depois),15)
        evidencia("Filtro CCS2 reposiciona após arraste intencional")
    }
    @MainActor func test02FechamentoSemDependerDaBusca() throws {
        print("FLUI_CLOCK MAPA_ABRIR");fflush(stdout)
        abrirFiltros();botao("Limpar busca e filtros").tap()
        selecionar("Carregadores livres");selecionar("Aberto agora");selecionar("1 km");aplicar()
        let campo=app.textFields.matching(NSPredicate(format:"label == %@","Buscar no mapa")).firstMatch
        print("FLUI_HORARIO_SEM_BUSCA campo=\(String(reflecting:campo.value))")
        XCTAssertTrue((campo.value as? String ?? "").isEmpty || (campo.value as? String ?? "").hasPrefix("Buscar endereço"))
        XCTAssertTrue(botao(vila).waitForExistence(timeout:45),app.debugDescription)
        let minimizar=botao("Minimizar opções demonstrativas para ver o mapa inteiro");if minimizar.exists {minimizar.tap()}
        for _ in 0..<4 {botao("Diminuir zoom do mapa").tap()}
        Thread.sleep(forTimeInterval:1)
        XCTAssertTrue(botao("Você na FIAP").exists)
        let fiap=centro("Você na FIAP")
        evidencia("Antes das 22h: filtro sem busca e zoom escolhido")
        rapido();evidencia("FluIA recomenda Vila Mariana antes das 22h")
        print("FLUI_CLOCK MAPA_FECHAR");fflush(stdout)
        XCTAssertTrue(texto("Nenhuma opção viável confirmada").waitForExistence(timeout:55),app.debugDescription)
        evidencia("Após 22h: FluIA atualiza sem navegação")
        botao("Fechar assistente Flui IA").tap()
        XCTAssertFalse(botao(vila).exists)
        let apos=centro("Você na FIAP")
        print("FLUI_FRAME_FECHAMENTO antes=\(fiap) depois=\(apos)")
        XCTAssertLessThanOrEqual(distancia(fiap,apos),2)
        botao("Mostrar opções demonstrativas").tap()
        XCTAssertTrue(texto("Nenhum ponto disponível").waitForExistence(timeout:8))
        evidencia("Após 22h: marcador e cartão removidos, enquadramento preservado")
        print("FLUI_CLOCK FICHA_ABRIR");fflush(stdout)
        XCTAssertTrue(botao(vila).waitForExistence(timeout:45),app.debugDescription)
        rapido();botao("Ver \(vila) no mapa").tap()
        XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:15))
        evidencia("Ficha Vila Mariana aberta antes das 22h")
        print("FLUI_CLOCK FICHA_FECHAR");fflush(stdout)
        XCTAssertTrue(texto("Fechado agora").waitForExistence(timeout:55))
        XCTAssertTrue(texto("Recarga não confirmada neste ponto").exists)
        evidencia("Ficha atualiza fechamento automaticamente")
        print("FLUI_CLOCK RESTAURAR");fflush(stdout)
        botao("Voltar ao mapa").tap()
    }
}
