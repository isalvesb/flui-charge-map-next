import XCTest
import Darwin

final class FluiValidacao: XCTestCase {
    let app = XCUIApplication(bundleIdentifier: "host.exp.Exponent")
    let plug = "Plug & Café Consolação"

    func botao(_ nome: String) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label == %@", nome)).firstMatch
    }
    func texto(_ nome: String) -> XCUIElement { app.staticTexts.matching(NSPredicate(format: "label == %@", nome)).firstMatch }
    func evidencia(_ nome: String) {
        print("FLUI_EVIDENCIA \(nome)\n\(app.debugDescription)")
        let a = XCTAttachment(screenshot: app.screenshot()); a.name = nome; a.lifetime = .keepAlways; add(a)
    }
    func centro(_ nome: String) -> CGPoint { let f = botao(nome).frame; return CGPoint(x:f.midX,y:f.midY) }
    func distancia(_ a: CGPoint, _ b: CGPoint) -> CGFloat { hypot(a.x-b.x,a.y-b.y) }
    func preservar(_ antes: CGPoint, _ depois: CGPoint, _ nome: String) {
        print("FLUI_FRAME \(nome) antes=\(antes) depois=\(depois)")
        XCTAssertLessThanOrEqual(distancia(antes,depois), 2.0, "Enquadramento mudou sem ação do usuário: \(nome)")
    }
    func buscar(_ valor: String) {
        let campo = app.textFields.matching(NSPredicate(format: "label == %@", "Buscar no mapa")).firstMatch
        campo.tap()
        if let atual = campo.value as? String, !atual.hasPrefix("Buscar endereço") {
            campo.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: atual.count))
        }
        campo.typeText(valor + "\n")
    }
    func filtroAberto() {
        let abrir = botao("Mostrar atalhos de filtro"); if abrir.exists { abrir.tap() }
        let filtro = app.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", "Aberto agora")).firstMatch
        XCTAssertTrue(filtro.waitForExistence(timeout:5))
        if !filtro.isSelected { filtro.tap() }
        XCTAssertTrue(filtro.isSelected)
    }
    override func setUpWithError() throws {
        continueAfterFailure = false
        app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout:3) {
            let recente = botao("flui-charge-map")
            XCTAssertTrue(recente.waitForExistence(timeout:5),app.debugDescription)
            recente.tap()
            XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
        }
    }

    @MainActor func test01ZoomDeslocamentoEReposicionamento() throws {
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:15))
        let minimizar = botao("Minimizar opções demonstrativas para ver o mapa inteiro")
        if minimizar.exists { minimizar.tap() }
        let distanciaInicial = distancia(centro("Você na FIAP"),centro("Flui Express MASP"))
        botao("Diminuir zoom do mapa").tap()
        Thread.sleep(forTimeInterval:1)
        XCTAssertLessThan(distancia(centro("Você na FIAP"),centro("Flui Express MASP")),distanciaInicial-5)
        let inicio = app.coordinate(withNormalizedOffset:CGVector(dx:0.30,dy:0.48))
        let fim = app.coordinate(withNormalizedOffset:CGVector(dx:0.53,dy:0.58))
        let antesDeArrastar = centro("Você na FIAP")
        inicio.press(forDuration:0.1,thenDragTo:fim)
        Thread.sleep(forTimeInterval:2)
        XCTAssertGreaterThan(distancia(antesDeArrastar,centro("Você na FIAP")),30)
        let fiap = centro("Você na FIAP"), masp = centro("Flui Express MASP")
        evidencia("Zoom e deslocamento escolhidos")
        // Mais de dois ciclos reais de 30s; sem navegação, reload ou relógio forçado.
        Thread.sleep(forTimeInterval:35)
        preservar(fiap,centro("Você na FIAP"),"FIAP após primeiro ciclo")
        preservar(masp,centro("Flui Express MASP"),"MASP após primeiro ciclo")
        Thread.sleep(forTimeInterval:35)
        preservar(fiap,centro("Você na FIAP"),"FIAP após segundo ciclo")
        preservar(masp,centro("Flui Express MASP"),"MASP após segundo ciclo")
        evidencia("Enquadramento preservado após 70 segundos")
        botao("Centralizar localização na FIAP").tap(); Thread.sleep(forTimeInterval:1)
        XCTAssertGreaterThan(distancia(fiap,centro("Você na FIAP")),30)
        XCTAssertFalse(botao("Higienópolis Prime Charge").exists)
        buscar("Higienópolis Prime Charge")
        XCTAssertTrue(botao("Higienópolis Prime Charge").waitForExistence(timeout:10))
        XCTAssertTrue(botao("Higienópolis Prime Charge").isHittable)
        inicio.press(forDuration:0.1,thenDragTo:fim); Thread.sleep(forTimeInterval:1)
        let antesFiltro = centro("Higienópolis Prime Charge")
        filtroAberto(); Thread.sleep(forTimeInterval:1)
        XCTAssertGreaterThan(distancia(antesFiltro,centro("Higienópolis Prime Charge")),20)
        evidencia("Centralização, busca e filtro reposicionam intencionalmente")
    }

    @MainActor func test02FechamentoMapaFiltroFluiaSemMoverCamera() throws {
        print("FLUI_CLOCK MAPA_ABRIR"); fflush(stdout)
        buscar(plug); filtroAberto()
        XCTAssertTrue(botao(plug).waitForExistence(timeout:45))
        botao("Diminuir zoom do mapa").tap(); Thread.sleep(forTimeInterval:1)
        let fiap = centro("Você na FIAP")
        evidencia("Plug aberto com filtro ativo e zoom próprio")
        botao("Abrir assistente Flui IA").tap()
        let rapido = botao("Quero carregar rápido"); XCTAssertTrue(rapido.waitForExistence(timeout:5)); rapido.tap()
        XCTAssertTrue(botao("Ver \(plug) no mapa").waitForExistence(timeout:10))
        evidencia("FluIA recomenda Plug antes das 20h")
        print("FLUI_CLOCK MAPA_FECHAR"); fflush(stdout)
        XCTAssertTrue(texto("Nenhuma opção viável confirmada").waitForExistence(timeout:55))
        evidencia("FluIA retira recomendação automaticamente após 20h")
        botao("Fechar assistente Flui IA").tap()
        XCTAssertTrue(texto("Nenhum ponto disponível").waitForExistence(timeout:10))
        XCTAssertFalse(botao(plug).exists)
        preservar(fiap,centro("Você na FIAP"),"FIAP após fechar e remover primeiro resultado")
        evidencia("Filtro remove marcador e cartão sem reposicionar câmera")
    }

    @MainActor func test03FechamentoAutomaticoDaFicha() throws {
        print("FLUI_CLOCK FICHA_ABRIR"); fflush(stdout)
        buscar(plug); filtroAberto()
        XCTAssertTrue(botao(plug).waitForExistence(timeout:45))
        botao(plug).tap()
        XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:15))
        evidencia("Ficha aberta antes das 20h")
        print("FLUI_CLOCK FICHA_FECHAR"); fflush(stdout)
        XCTAssertTrue(texto("Fechado agora").waitForExistence(timeout:55))
        XCTAssertTrue(texto("Recarga não confirmada neste ponto").exists)
        evidencia("Ficha fecha automaticamente sem navegação")
        botao("Voltar ao mapa").tap()
        print("FLUI_CLOCK RESTAURAR"); fflush(stdout)
    }
}
