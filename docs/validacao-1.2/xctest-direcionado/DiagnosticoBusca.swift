import XCTest

final class FluiValidacao: XCTestCase {
    let app = XCUIApplication(bundleIdentifier:"host.exp.Exponent")
    func botao(_ nome:String)->XCUIElement {app.buttons.matching(NSPredicate(format:"label == %@",nome)).firstMatch}
    func evidencia(_ nome:String){
        print("FLUI_EVIDENCIA \(nome)\n\(app.debugDescription)")
        let a=XCTAttachment(screenshot:app.screenshot());a.name=nome;a.lifetime = .keepAlways;add(a)
    }
    @MainActor func testDiagnosticoDaBusca() throws {
        continueAfterFailure=false
        app.activate()
        if !botao("Abrir busca e filtros").waitForExistence(timeout:3){
            let recente=botao("flui-charge-map");XCTAssertTrue(recente.waitForExistence(timeout:8),app.debugDescription);recente.tap()
        }
        XCTAssertTrue(botao("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
        let campo=app.textFields.matching(NSPredicate(format:"label == %@","Buscar no mapa")).firstMatch
        print("FLUI_BUSCA_ANTES \(String(reflecting:campo.value))")
        campo.tap();campo.typeText("Higienópolis Prime Charge\n")
        print("FLUI_BUSCA_DEPOIS \(String(reflecting:campo.value))")
        evidencia("Valor real da busca após typeText do XCTest")
        XCTAssertEqual((campo.value as? String)?.trimmingCharacters(in:.whitespacesAndNewlines),"Higienópolis Prime Charge","A entrada do teste divergiu do texto pedido")
        XCTAssertTrue(botao("Higienópolis Prime Charge").waitForExistence(timeout:8),app.debugDescription)
    }
}
