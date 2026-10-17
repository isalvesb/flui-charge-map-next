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
    @MainActor func testPaulistaFiltrosEFichaAtual() throws {
        continueAfterFailure=false; abrirProjeto(); limparFiltros()
        let antes=dadosBateria(bateria().label)
        configuracoes(); salvarOrigem("Paulista"); mapaDasConfiguracoes()
        XCTAssertEqual(dadosBateria(bateria().label),antes)
        let minimizar=botao("Minimizar opções demonstrativas para ver o mapa inteiro")
        if minimizar.exists { minimizar.tap() }
        botao("Centralizar origem demonstrativa: Paulista").tap(); Thread.sleep(forTimeInterval:1)
        let origem=botao("Origem demonstrativa: Paulista")
        XCTAssertTrue(origem.waitForExistence(timeout:8),app.debugDescription)
        let mapa=app.otherElements.matching(NSPredicate(format:"label == %@","Mapa com pontos de recarga próximos")).firstMatch
        evidencia("10-paulista-centralizada")
        registrar("CENTRALIZACAO origem=\(origem.frame) mapa=\(mapa.frame)")
        XCTAssertLessThanOrEqual(abs(origem.frame.midX-mapa.frame.midX),30)
        XCTAssertLessThanOrEqual(abs(origem.frame.midY-mapa.frame.midY),30)
        evidencia("10-paulista-centralizada")
        reiniciar()
        XCTAssertTrue(botao("Centralizar origem demonstrativa: Paulista").exists)
        XCTAssertEqual(dadosBateria(bateria().label),antes)
        botao("Abrir busca e filtros").tap()
        XCTAssertTrue(botao("Limpar busca e filtros").waitForExistence(timeout:8))
        let raio=botao("500 m"); revelar(raio); raio.tap()
        XCTAssertTrue(botao("500 m, selecionado").exists)
        XCTAssertTrue(contem("Em linha reta desde Paulista").exists)
        evidencia("11-paulista-raio-500m")
        botao("Ver pontos encontrados no mapa").tap()
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:8))
        evidencia("12-paulista-mapa-filtrado")
        reiniciar(); botao("Abrir busca e filtros").tap()
        XCTAssertTrue(botao("500 m, selecionado").waitForExistence(timeout:8),app.debugDescription)
        registrar("APROVADO_PAULISTA_ORIGEM_FILTRO_PERSISTIDOS bateria preservada: " + antes)
        botao("Limpar busca e filtros").tap(); botao("Ver pontos encontrados no mapa").tap()
        let busca=campo("Buscar no mapa"); XCTAssertTrue(busca.waitForExistence(timeout:8)); busca.tap()
        var prefixo=""
        for c in "Higien" {
            prefixo.append(c); busca.typeText(String(c)); let esperado=prefixo
            let e=XCTNSPredicateExpectation(predicate:NSPredicate{_,_ in (busca.value as? String)==esperado},object:nil)
            XCTAssertEqual(XCTWaiter.wait(for:[e],timeout:3),.completed)
        }
        busca.typeText("\n")
        let cartao=app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@",higi+". Opção demonstrativa.")).firstMatch
        XCTAssertTrue(cartao.waitForExistence(timeout:10),app.debugDescription)
        XCTAssertTrue(cartao.label.contains("≈1,7 km em linha reta"),cartao.label)
        registrar("MAPA_PAULISTA " + cartao.label)
        botao("Abrir assistente Flui IA").tap()
        XCTAssertTrue(botao("Quero carregar rápido").waitForExistence(timeout:8)); botao("Quero carregar rápido").tap()
        let ver=botao("Ver \(higi) no mapa"); XCTAssertTrue(ver.waitForExistence(timeout:10),app.debugDescription)
        XCTAssertTrue(texto("≈1,7 km").exists,app.debugDescription)
        XCTAssertTrue(texto("Chegada ≈39%").exists,app.debugDescription)
        evidencia("13-paulista-fluia")
        ver.tap(); XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:10),app.debugDescription)
        XCTAssertTrue(texto("≈1,7 km").exists,app.debugDescription)
        XCTAssertTrue(contem("Chegada estimada com 39% de bateria").exists,app.debugDescription)
        XCTAssertTrue(contem("Em linha reta desde Paulista").exists)
        app.scrollViews.firstMatch.swipeUp(); evidencia("14-paulista-ficha-atual")
        registrar("APROVADO_FICHA_ATUAL_PAULISTA 1,7km / 39%, sem modificar relógio")
        botao("Voltar ao mapa").tap(); limparFiltros()
    }
}
