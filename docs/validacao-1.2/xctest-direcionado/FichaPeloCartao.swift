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
    @MainActor func testFichaPeloCartaoSemBusca() throws {
        continueAfterFailure=false;app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout:3){
            let recente=botao("flui-charge-map");XCTAssertTrue(recente.waitForExistence(timeout:8),app.debugDescription);recente.tap()
        }
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
        print("FLUI_CLOCK FICHA_ABRIR");fflush(stdout)
        let cartao=app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@","Flui Vila Mariana Lins. Opção demonstrativa.")).firstMatch
        XCTAssertTrue(cartao.waitForExistence(timeout:15),app.debugDescription)
        for _ in 0..<3 {if cartao.isHittable {break};app.scrollViews.firstMatch.swipeUp()}
        XCTAssertTrue(cartao.isHittable,app.debugDescription)
        cartao.tap()
        XCTAssertTrue(texto("Aberto agora").waitForExistence(timeout:15),app.debugDescription)
        evidencia("Ficha aberta pelo cartão, antes das 22h")
        print("FLUI_CLOCK FICHA_FECHAR");fflush(stdout)
        XCTAssertTrue(texto("Fechado agora").waitForExistence(timeout:55),app.debugDescription)
        XCTAssertTrue(texto("Recarga não confirmada neste ponto").exists)
        evidencia("Ficha muda automaticamente para fechado, sem navegação")
        print("FLUI_CLOCK RESTAURAR");fflush(stdout)
        Thread.sleep(forTimeInterval:2)
        botao("Voltar ao mapa").tap()
    }
}
