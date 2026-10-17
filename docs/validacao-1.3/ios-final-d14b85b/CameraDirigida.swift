import XCTest
import Darwin

final class FluiValidacao: XCTestCase {
    let app = XCUIApplication(bundleIdentifier: "host.exp.Exponent")
    let veiculo = "Flui iOS NEXT"
    let higi = "Higienópolis Prime Charge"
    func botao(_ nome: String) -> XCUIElement { app.buttons.matching(NSPredicate(format: "label == %@", nome)).firstMatch }
    func texto(_ nome: String) -> XCUIElement { app.staticTexts.matching(NSPredicate(format: "label == %@", nome)).firstMatch }
    func campo(_ nome: String) -> XCUIElement { app.textFields.matching(NSPredicate(format: "label == %@", nome)).firstMatch }
    func contem(_ parte: String) -> XCUIElement { app.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS %@", parte)).firstMatch }
    func registrar(_ mensagem: String) { print("FLUI_13 \(mensagem)"); fflush(stdout) }
    func evidencia(_ nome: String) {
        registrar("EVIDENCIA \(nome)\n\(app.debugDescription)")
        let a = XCTAttachment(screenshot: app.screenshot()); a.name = nome; a.lifetime = .keepAlways; add(a)
    }
    func revelar(_ e: XCUIElement) {
        for _ in 0..<4 { if e.isHittable { return }; app.scrollViews.firstMatch.swipeUp() }
        XCTAssertTrue(e.isHittable, app.debugDescription)
    }
    func bateria() -> XCUIElement { app.buttons.matching(NSPredicate(format: "label CONTAINS %@", "Bateria para estimativa:")).firstMatch }
    func dadosBateria(_ label: String) -> String {
        let parte = label.components(separatedBy: "Bateria para estimativa: ").last ?? label
        return parte.components(separatedBy: ". Cerca de ").first ?? parte
    }
    func abrirProjeto() {
        app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout: 3) {
            let recente = botao("flui-charge-map")
            XCTAssertTrue(recente.waitForExistence(timeout: 10), app.debugDescription); recente.tap()
        }
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout: 45), app.debugDescription)
        XCTAssertTrue(bateria().waitForExistence(timeout: 8))
    }
    func limparFiltros() {
        botao("Abrir busca e filtros").tap()
        XCTAssertTrue(botao("Limpar busca e filtros").waitForExistence(timeout: 8))
        botao("Limpar busca e filtros").tap()
        botao("Ver pontos encontrados no mapa").tap()
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout: 10))
    }
    func configuracoes() {
        botao("Abrir perfil").tap()
        XCTAssertTrue(botao("Abrir configurações").waitForExistence(timeout: 10)); botao("Abrir configurações").tap()
        XCTAssertTrue(campo("Veículo demonstrativo").waitForExistence(timeout: 10))
        let e = XCTNSPredicateExpectation(predicate: NSPredicate { _,_ in self.campo("Veículo demonstrativo").isEnabled }, object: nil)
        XCTAssertEqual(XCTWaiter.wait(for: [e], timeout: 10), .completed)
    }
    func salvarOrigem(_ origem: String) {
        let origemBotao = botao("Selecionar origem \(origem)"); revelar(origemBotao); origemBotao.tap()
        XCTAssertTrue(origemBotao.isSelected)
        revelar(botao("Salvar demonstração")); botao("Salvar demonstração").tap()
        XCTAssertTrue(texto("Demonstração salva neste dispositivo").waitForExistence(timeout: 8), app.debugDescription)
    }
    func mapaDasConfiguracoes() {
        revelar(botao("Abrir mapa para editar bateria")); botao("Abrir mapa para editar bateria").tap()
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout: 10))
    }
    func reiniciar() {
        registrar("REINICIAR_APP terminate/launch, sem editar armazenamento")
        app.terminate(); app.launch(); abrirProjeto()
    }
    @MainActor func test01NovaBateriaEPersistencia() throws {
        continueAfterFailure=false; abrirProjeto()
        let antes=bateria().label; registrar("BATERIA_ANTES " + antes)
        let percentual=Int(dadosBateria(antes).components(separatedBy:" por cento")[0])!
        let novo=percentual>5 ? percentual-5 : percentual+5
        bateria().tap()
        XCTAssertTrue(botao("Definir carga da bateria").waitForExistence(timeout:8))
        XCTAssertTrue(texto("\(percentual)%").waitForExistence(timeout:5),app.debugDescription)
        evidencia("01-bateria-antes-edicao")
        botao(percentual>5 ? "Diminuir bateria em 5 por cento" : "Aumentar bateria em 5 por cento").coordinate(withNormalizedOffset:CGVector(dx:0.5,dy:0.5)).tap()
        XCTAssertTrue(texto("\(novo)%").waitForExistence(timeout:8),app.debugDescription)
        evidencia("02-nova-bateria-selecionada")
        botao("Definir carga da bateria").tap()
        let salvo=XCTNSPredicateExpectation(predicate:NSPredicate{_,_ in self.bateria().exists && self.bateria().label.contains("\(novo) por cento. Informado manualmente.")},object:nil)
        XCTAssertEqual(XCTWaiter.wait(for:[salvo],timeout:10),.completed)
        let manual=dadosBateria(bateria().label)
        registrar("BATERIA_SALVA " + bateria().label)
        reiniciar()
        XCTAssertEqual(dadosBateria(bateria().label),manual)
        evidencia("03-bateria-manual-persistida")
        registrar("APROVADO_NOVA_BATERIA \(percentual) -> \(novo), origem e data persistidas: \(manual)")
    }
    @MainActor func test02ConsistenciaMapaFichaFluia() throws {
        continueAfterFailure=false; abrirProjeto(); limparFiltros()
        XCTAssertTrue(botao("Centralizar origem demonstrativa: Vila Mariana").exists,app.debugDescription)
        let pct=Int(dadosBateria(bateria().label).components(separatedBy:" por cento")[0])!
        let chegada=Int((Double(pct)-4.8727/300*100).rounded())
        registrar("ENTRADAS Vila Mariana, autonomia=300, bateria=\(pct), chegada esperada=\(chegada)")
        let busca=campo("Buscar no mapa");busca.tap()
        var prefixo=""
        for c in "Higien" {
            prefixo.append(c);busca.typeText(String(c));let esperado=prefixo
            let e=XCTNSPredicateExpectation(predicate:NSPredicate{_,_ in (busca.value as? String)==esperado},object:nil)
            XCTAssertEqual(XCTWaiter.wait(for:[e],timeout:3),.completed)
        }
        busca.typeText("\n")
        let cartao=app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@",higi+". Opção demonstrativa.")).firstMatch
        XCTAssertTrue(cartao.waitForExistence(timeout:12),app.debugDescription)
        XCTAssertTrue(cartao.label.contains("≈4,9 km em linha reta"),cartao.label)
        XCTAssertTrue(cartao.label.contains("Chegada estimada com \(chegada)% de bateria"),cartao.label)
        registrar("MAPA " + cartao.label); evidencia("04-estimativas-mapa")
        botao("Abrir assistente Flui IA").tap()
        XCTAssertTrue(botao("Quero carregar rápido").waitForExistence(timeout:8));botao("Quero carregar rápido").tap()
        let ver=botao("Ver \(higi) no mapa")
        XCTAssertTrue(ver.waitForExistence(timeout:15),app.debugDescription)
        XCTAssertTrue(texto("Chegada ≈\(chegada)%").exists,app.debugDescription)
        XCTAssertTrue(texto("≈4,9 km").exists,app.debugDescription)
        evidencia("05-estimativas-fluia")
        ver.tap();XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:10))
        XCTAssertTrue(texto("≈4,9 km").exists,app.debugDescription)
        XCTAssertTrue(contem("Chegada estimada com \(chegada)% de bateria").exists,app.debugDescription)
        XCTAssertTrue(contem("Em linha reta desde Vila Mariana").exists)
        app.scrollViews.firstMatch.swipeUp(); evidencia("06-estimativas-ficha")
        registrar("APROVADO_CONSISTENCIA Higienópolis ≈4,9km / \(chegada)% nas três telas")
        botao("Voltar ao mapa").tap();XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:10));limparFiltros()
    }
    @MainActor func test03OrigemCentralizacaoEEstabilidade() throws {
        continueAfterFailure=false; abrirProjeto(); limparFiltros()
        configuracoes();salvarOrigem("Vila Mariana");mapaDasConfiguracoes()
        let minimizar=botao("Minimizar opções demonstrativas para ver o mapa inteiro")
        if minimizar.exists { minimizar.tap() }
        botao("Centralizar origem demonstrativa: Vila Mariana").tap();Thread.sleep(forTimeInterval:1)
        let origem=botao("Origem demonstrativa: Vila Mariana")
        XCTAssertTrue(origem.waitForExistence(timeout:8),app.debugDescription)
        let mapa=app.otherElements.matching(NSPredicate(format:"label == %@","Mapa com pontos de recarga próximos")).firstMatch
        XCTAssertTrue(mapa.exists)
        let o=origem.frame,m=mapa.frame
        registrar("ORIGEM_ALTERADA_E_CENTRALIZADA Vila Mariana origem=\(o), mapa=\(m)")
        XCTAssertLessThanOrEqual(abs(o.midX-m.midX),30)
        XCTAssertLessThanOrEqual(abs(o.midY-m.midY),30)
        evidencia("07-nova-origem-vila-centralizada")
        app.coordinate(withNormalizedOffset:CGVector(dx:0.6,dy:0.34)).press(forDuration:0.1,thenDragTo:app.coordinate(withNormalizedOffset:CGVector(dx:0.35,dy:0.43)))
        Thread.sleep(forTimeInterval:1)
        let antes=origem.frame
        XCTAssertGreaterThan(hypot(antes.midX-o.midX,antes.midY-o.midY),20)
        evidencia("08-enquadramento-escolhido")
        Thread.sleep(forTimeInterval:35)
        let depois=origem.frame
        registrar("CAMERA_35S antes=\(antes), depois=\(depois)")
        XCTAssertLessThanOrEqual(hypot(antes.midX-depois.midX,antes.midY-depois.midY),2)
        evidencia("09-enquadramento-preservado")
        registrar("APROVADO_ORIGEM_CENTRALIZACAO_ESTABILIDADE")
    }
}
