import XCTest
final class FluiValidacao: XCTestCase {
  let app = XCUIApplication(bundleIdentifier: "host.exp.Exponent")
  func button(_ label: String) -> XCUIElement { app.buttons.matching(NSPredicate(format: "label == %@", label)).firstMatch }
  func shot(_ name: String) { let capture = XCTAttachment(screenshot: XCUIScreen.main.screenshot()); capture.name = name; capture.lifetime = .keepAlways; add(capture) }
  func visibleKeyboard() -> Bool { let keyboard = app.keyboards.firstMatch; return keyboard.exists && keyboard.frame.height > 0 && keyboard.frame.minY < app.frame.height }
  @MainActor func testDiagnosticoTeclado() {
    app.activate()
    for label in ["Enviar mensagem", "Fechar assistente", "Fechar assistente FluIA"] { let item = button(label); print("FLUI HIT \(label) frame=\(item.frame) hittable=\(item.isHittable)") }
    print("FLUI KEYBOARD \(app.keyboards.firstMatch.frame)")
    print(app.debugDescription)
    shot("diagnostico-teclado-real")
  }
  @MainActor func testFluxoCompactoAmpliado() {
    continueAfterFailure = false
    app.activate()
    if button("Fechar assistente").waitForExistence(timeout: 2) { button("Fechar assistente").tap() }
    let launcher = button("Abrir assistente Flui IA")
    if launcher.waitForExistence(timeout: 3) {
      launcher.tap()
      XCTAssertTrue(button("Quero carregar rápido").waitForExistence(timeout: 5))
      if button("Desativar voz da FluIA").exists { button("Desativar voz da FluIA").tap() }
      button("Quero carregar rápido").tap()
      let directRoute = button("Iniciar rota para Higienópolis Prime Charge")
      XCTAssertTrue(directRoute.waitForExistence(timeout: 8))
      directRoute.tap()
    }
    let skip = button("Continuar sem localização")
    XCTAssertTrue(skip.waitForExistence(timeout: 15), app.debugDescription)
    print("FLUI GEOMETRIA app=\(app.frame) botao=\(skip.frame) state=\(app.state)")
    print(app.debugDescription)
    shot("diagnostico-modal-ampliado")
    let reachable = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in skip.isHittable }, object: nil)
    XCTAssertEqual(XCTWaiter.wait(for: [reachable], timeout: 5), .completed)
    XCTAssertTrue(button("Usar localização atual").isHittable)
    XCTAssertTrue(button("Cancelar").isHittable)
    shot("localizacao-ampliada")
    skip.tap()
    XCTAssertTrue(button("Abrir Google Maps").waitForExistence(timeout: 5))
    XCTAssertTrue(button("Abrir Waze").isHittable)
    XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "não garante atendimento")).firstMatch.exists)
    shot("confirmacao-preservada")
    button("Cancelar").tap()
    XCTAssertTrue(button("Ver mapa").waitForExistence(timeout: 5))
    button("Ver mapa").tap()
    let assistant = button("Abrir assistente Flui IA")
    XCTAssertTrue(assistant.waitForExistence(timeout: 10))
    for label in ["Aberto agora", "Aumentar zoom do mapa", "Diminuir zoom do mapa", "Planejar viagem"] {
      XCTAssertTrue(button(label).isHittable, label)
      XCTAssertFalse(assistant.frame.intersects(button(label).frame), label)
    }
    shot("mapa-ampliado-sem-sobreposicao")
    assistant.tap()
    let input = app.textFields["Mensagem para a FluIA"]
    XCTAssertTrue(input.waitForExistence(timeout: 5))
    if button("Desativar voz da FluIA").exists { button("Desativar voz da FluIA").tap() }
    input.tap()
    for char in "quero carregar rapido" { input.typeText(String(char)) }
    XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout: 5))
    let sendReady = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in self.button("Enviar mensagem").isHittable && self.visibleKeyboard() }, object: nil)
    XCTAssertEqual(XCTWaiter.wait(for: [sendReady], timeout: 8), .completed)
    button("Enviar mensagem").tap()
    let route = button("Iniciar rota para o ponto recomendado")
    XCTAssertTrue(route.waitForExistence(timeout: 10))
    input.tap()
    let keyboardVisible = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in self.visibleKeyboard() }, object: nil)
    XCTAssertEqual(XCTWaiter.wait(for: [keyboardVisible], timeout: 5), .completed)
    for _ in 0..<3 { if route.isHittable { break }; app.scrollViews["fluia-conteudo"].swipeUp() }
    XCTAssertTrue(route.isHittable)
    print("FLUI TECLADO \(app.keyboards.firstMatch.frame) CTA \(route.frame) ENVIAR \(button("Enviar mensagem").frame)")
    XCTAssertLessThanOrEqual(route.frame.maxY, app.keyboards.firstMatch.frame.minY + 1)
    XCTAssertTrue(button("Enviar mensagem").isHittable)
    XCTAssertLessThanOrEqual(button("Enviar mensagem").frame.maxY, app.keyboards.firstMatch.frame.minY + 1)
    XCTAssertTrue(button("Fechar assistente").isHittable)
    shot("resposta-resumida-teclado-ampliado")
    button("Fechar assistente").tap()
    XCTAssertTrue(assistant.waitForExistence(timeout: 8))
    let hidden = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in !self.visibleKeyboard() }, object: nil)
    XCTAssertEqual(XCTWaiter.wait(for: [hidden], timeout: 5), .completed)
    assistant.tap()
    XCTAssertTrue(input.waitForExistence(timeout: 5))
    shot("reabertura-ampliada")
    button("Fechar assistente").tap()
  }
}
