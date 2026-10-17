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
    func esperarValor(_ elemento: XCUIElement, _ valor: String) {
        let e = XCTNSPredicateExpectation(predicate: NSPredicate { _,_ in (elemento.value as? String) == valor }, object: nil)
        XCTAssertEqual(XCTWaiter.wait(for: [e], timeout: 4), .completed, "Valor esperado=\(valor), efetivo=\(String(reflecting: elemento.value))")
    }
    func revelar(_ elemento: XCUIElement) {
        for _ in 0..<5 { if elemento.isHittable { return }; app.scrollViews.firstMatch.swipeUp() }
        XCTAssertTrue(elemento.isHittable, app.debugDescription)
    }
    func editar(_ elemento: XCUIElement, _ valor: String) {
        revelar(elemento)
        elemento.coordinate(withNormalizedOffset: CGVector(dx: 0.95, dy: 0.5)).tap()
        let atual = elemento.value as? String ?? ""
        for _ in atual { elemento.typeText(XCUIKeyboardKey.delete.rawValue) }
        esperarValor(elemento, "")
        var prefixo = ""
        for c in valor { prefixo.append(c); elemento.typeText(String(c)); esperarValor(elemento, prefixo) }
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
    func validarHigienopolis(_ origem: String, _ distancia: String, _ chegada: String) {
        limparFiltros()
        editar(campo("Buscar no mapa"), higi); campo("Buscar no mapa").typeText("\n")
        let cartao = app.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", higi + ". Opção demonstrativa.")).firstMatch
        XCTAssertTrue(cartao.waitForExistence(timeout: 15), app.debugDescription)
        registrar("MAPA \(origem): \(cartao.label)")
        XCTAssertTrue(cartao.label.contains(distancia + " em linha reta"), cartao.label)
        XCTAssertTrue(cartao.label.contains("Chegada estimada com \(chegada)% de bateria"), cartao.label)
        XCTAssertTrue(contem("Origem: \(origem) · distâncias em linha reta").exists)
        XCTAssertTrue(bateria().label.contains("Cerca de 105 quilômetros estimados"))
        evidencia("mapa-higienopolis-\(origem)")
        botao("Abrir assistente Flui IA").tap()
        XCTAssertTrue(botao("Quero carregar rápido").waitForExistence(timeout: 8)); botao("Quero carregar rápido").tap()
        let ver = botao("Ver \(higi) no mapa")
        XCTAssertTrue(ver.waitForExistence(timeout: 15), app.debugDescription)
        XCTAssertTrue(texto("Chegada ≈\(chegada)%").exists, app.debugDescription)
        XCTAssertTrue(texto(distancia).exists, app.debugDescription)
        XCTAssertTrue(contem("\(veiculo) · origem demonstrativa: \(origem)").exists)
        evidencia("fluia-higienopolis-\(origem)")
        ver.tap(); XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout: 10))
        XCTAssertTrue(texto(distancia).exists, app.debugDescription)
        XCTAssertTrue(contem("Em linha reta desde \(origem). Não é distância de percurso.").exists)
        XCTAssertTrue(contem("Chegada estimada com \(chegada)% de bateria").exists)
        XCTAssertTrue(contem("Não garante recarga no local").exists)
        evidencia("ficha-higienopolis-\(origem)")
        registrar("APROVADO_CONSISTENCIA \(origem) Higi \(distancia), chegada \(chegada)%, alcance 105 km")
        botao("Voltar ao mapa").tap()
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout: 10)); limparFiltros()
    }
    @MainActor func test01ConfiguracaoEPersistencia() throws {
        continueAfterFailure = false; abrirProjeto(); limparFiltros()
        let bateriaInicial = dadosBateria(bateria().label)
        registrar("BATERIA_INICIAL \(bateria().label)"); evidencia("01-mapa-inicial")
        configuracoes()
        registrar("CONFIG_INICIAL nome=\(String(reflecting: campo("Veículo demonstrativo").value)) autonomia=\(String(reflecting: campo("Autonomia com bateria cheia em quilômetros").value))")
        editar(campo("Veículo demonstrativo"), veiculo)
        editar(campo("Autonomia com bateria cheia em quilômetros"), "300")
        app.scrollViews.firstMatch.swipeUp()
        salvarOrigem("Vila Mariana"); evidencia("02-configuracao-salva-vila")
        mapaDasConfiguracoes()
        XCTAssertEqual(dadosBateria(bateria().label), bateriaInicial)
        reiniciar()
        XCTAssertEqual(dadosBateria(bateria().label), bateriaInicial)
        XCTAssertTrue(bateria().label.hasPrefix(veiculo + "."), bateria().label)
        XCTAssertTrue(botao("Centralizar origem demonstrativa: Vila Mariana").exists)
        configuracoes()
        esperarValor(campo("Veículo demonstrativo"), veiculo)
        esperarValor(campo("Autonomia com bateria cheia em quilômetros"), "300")
        XCTAssertTrue(botao("Selecionar origem Vila Mariana").isSelected)
        evidencia("03-configuracao-persistida-apos-reiniciar")
        registrar("APROVADO_PERSISTENCIA nome=\(veiculo), autonomia=300, origem=Vila Mariana, bateria preservada=\(bateriaInicial)")
        mapaDasConfiguracoes()
    }
    @MainActor func test02OrigemConsistenciaEBateria() throws {
        continueAfterFailure = false; abrirProjeto(); limparFiltros()
        XCTAssertTrue(bateria().label.hasPrefix(veiculo + "."), bateria().label)
        let dados = dadosBateria(bateria().label)
        let percentual = Int(dados.components(separatedBy: " por cento").first ?? "")!
        bateria().tap(); XCTAssertTrue(botao("Definir carga da bateria").waitForExistence(timeout: 8))
        if percentual != 35 {
            for _ in 0..<(abs(percentual - 35) / 5) {
                botao(percentual > 35 ? "Diminuir bateria em 5 por cento" : "Aumentar bateria em 5 por cento").tap()
            }
        }
        XCTAssertTrue(contem("Bateria selecionada em 35 por cento").exists, app.debugDescription)
        evidencia("04-bateria-editada-manualmente")
        botao("Definir carga da bateria").tap(); Thread.sleep(forTimeInterval: 1)
        XCTAssertTrue(bateria().label.contains("35 por cento. Informado manualmente."), bateria().label)
        let manual = dadosBateria(bateria().label)
        registrar("BATERIA_MANUAL \(bateria().label)")
        configuracoes(); salvarOrigem("FIAP"); mapaDasConfiguracoes()
        XCTAssertEqual(dadosBateria(bateria().label), manual)
        validarHigienopolis("FIAP", "≈2,1 km", "34")
        configuracoes(); salvarOrigem("Vila Mariana"); mapaDasConfiguracoes()
        XCTAssertEqual(dadosBateria(bateria().label), manual)
        validarHigienopolis("Vila Mariana", "≈4,9 km", "33")
        let minimizar = botao("Minimizar opções demonstrativas para ver o mapa inteiro")
        if minimizar.exists { minimizar.tap() }
        botao("Centralizar origem demonstrativa: Vila Mariana").tap(); Thread.sleep(forTimeInterval: 1)
        let origem = botao("Origem demonstrativa: Vila Mariana")
        XCTAssertTrue(origem.waitForExistence(timeout: 8), app.debugDescription)
        let mapa = app.otherElements.matching(NSPredicate(format: "label == %@", "Mapa com pontos de recarga próximos")).firstMatch
        XCTAssertTrue(mapa.exists)
        let o = origem.frame, m = mapa.frame
        registrar("ORIGEM_CENTRALIZADA marker=\(o) mapa=\(m)")
        XCTAssertLessThanOrEqual(abs(o.midX - m.midX), 30)
        XCTAssertLessThanOrEqual(abs(o.midY - m.midY), 30)
        evidencia("05-origem-vila-centralizada")
        mapa.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).press(forDuration: 0.1, thenDragTo: mapa.coordinate(withNormalizedOffset: CGVector(dx: 0.65, dy: 0.55)))
        Thread.sleep(forTimeInterval: 1)
        let antes = origem.frame
        XCTAssertGreaterThan(hypot(antes.midX-o.midX, antes.midY-o.midY), 20)
        evidencia("06-enquadramento-escolhido-origem-vila")
        Thread.sleep(forTimeInterval: 35)
        let depois = origem.frame
        registrar("CAMERA_35S antes=\(antes) depois=\(depois)")
        XCTAssertLessThanOrEqual(hypot(antes.midX-depois.midX, antes.midY-depois.midY), 2)
        evidencia("07-enquadramento-preservado-apos-ciclo")
        registrar("APROVADO_CAMERA origem Vila centralizada e enquadramento preservado em um ciclo")
        reiniciar()
        XCTAssertEqual(dadosBateria(bateria().label), manual)
        XCTAssertTrue(bateria().label.contains("Cerca de 105 quilômetros estimados"))
        XCTAssertTrue(botao("Centralizar origem demonstrativa: Vila Mariana").exists)
        evidencia("08-bateria-manual-persistida-apos-reiniciar")
        registrar("APROVADO_BATERIA_PERSISTIDA \(manual)")
    }
}
