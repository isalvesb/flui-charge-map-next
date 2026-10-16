import XCTest
import Darwin

final class FluiValidacao: XCTestCase {
    let app=XCUIApplication(bundleIdentifier:"host.exp.Exponent")
    func botao(_ nome:String)->XCUIElement {app.buttons.matching(NSPredicate(format:"label == %@",nome)).firstMatch}
    func texto(_ nome:String)->XCUIElement {app.staticTexts.matching(NSPredicate(format:"label == %@",nome)).firstMatch}
    func evidencia(_ nome:String){
        print("FLUI_EVIDENCIA \(nome)\n\(app.debugDescription)");fflush(stdout)
        let a=XCTAttachment(screenshot:app.screenshot());a.name=nome;a.lifetime = .keepAlways;add(a)
    }
    @MainActor func testFichaUxAutonomiaERecarga() throws {
        continueAfterFailure=false;app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout:3){
            let recente=botao("flui-charge-map");XCTAssertTrue(recente.waitForExistence(timeout:8),app.debugDescription);recente.tap()
        }
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
        print("FLUI_CLOCK FICHA_ABRIR");fflush(stdout)
        botao("Abrir busca e filtros").tap()
        XCTAssertTrue(botao("Limpar busca e filtros").waitForExistence(timeout:8))
        botao("Limpar busca e filtros").tap()
        for nome in ["Carregadores livres","1 km"] {
            let c=app.buttons.matching(NSPredicate(format:"label == %@ OR label == %@",nome,nome+", selecionado")).firstMatch
            for _ in 0..<5 {if c.isHittable {break};app.scrollViews.firstMatch.swipeUp()}
            XCTAssertTrue(c.isHittable,app.debugDescription)
            if !c.isSelected {c.tap()};XCTAssertTrue(c.isSelected)
        }
        botao("Ver pontos encontrados no mapa").tap()
        XCTAssertTrue(botao("Abrir assistente Flui IA").waitForExistence(timeout:10))
        botao("Abrir assistente Flui IA").tap()
        XCTAssertTrue(botao("Quero carregar rápido").waitForExistence(timeout:5))
        botao("Quero carregar rápido").tap()
        let ver=botao("Ver Flui Vila Mariana Lins no mapa")
        XCTAssertTrue(ver.waitForExistence(timeout:40),app.debugDescription)
        evidencia("FluIA fornece acesso direto à ficha da Vila Mariana")
        ver.tap()
        XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:15),app.debugDescription)
        XCTAssertTrue(texto("3 de 5 carregadores livres no exemplo").exists, app.debugDescription)
        let alcance = app.descendants(matching: .any).matching(NSPredicate(format: "label BEGINSWITH %@", "Autonomia para chegar ao local")).firstMatch
        XCTAssertTrue(alcance.exists, app.debugDescription)
        XCTAssertTrue(alcance.label.contains("Não garante recarga no local."))
        XCTAssertFalse(app.debugDescription.contains("Autonomia confortável"))
        let scroll = app.scrollViews.firstMatch
        scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.75)).press(forDuration: 0.1, thenDragTo: scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.58)))
        evidencia("UX corrigida — ficha aberta antes das 22h")
        print("FLUI_CLOCK FICHA_FECHAR");fflush(stdout)
        XCTAssertTrue(texto("Fechado agora").waitForExistence(timeout:55),app.debugDescription)
        XCTAssertTrue(texto("Recarga não confirmada neste ponto").exists)
        XCTAssertTrue(texto("5 carregadores cadastrados no exemplo. Recarga não confirmada.").exists, app.debugDescription)
        XCTAssertFalse(texto("3 de 5 carregadores livres no exemplo").exists)
        XCTAssertTrue(alcance.exists, app.debugDescription)
        XCTAssertTrue(alcance.label.contains("Chegada estimada"))
        XCTAssertTrue(alcance.label.contains("Não garante recarga no local."))
        evidencia("UX corrigida — ficha fechada automaticamente, sem interação durante a transição")
        print("FLUI_CLOCK RESTAURAR");fflush(stdout)
        Thread.sleep(forTimeInterval:2)
        botao("Voltar ao mapa").tap()
    }
}
