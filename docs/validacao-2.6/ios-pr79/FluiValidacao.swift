import XCTest
import Darwin
final class FluiValidacao: XCTestCase {
 let app = XCUIApplication(bundleIdentifier: "host.exp.Exponent")
 func b(_ name: String) -> XCUIElement { app.buttons.matching(NSPredicate(format:"label == %@",name)).firstMatch }
 func evidence(_ name: String) { print("FLUI79 \(name)\n\(app.debugDescription)"); fflush(stdout); let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a) }
 func keyboardAndControls() {
  let keyboard=app.keyboards.firstMatch
  XCTAssertTrue(keyboard.waitForExistence(timeout:5))
  XCTAssertLessThan(keyboard.frame.minY,app.frame.height,"Teclado virtual na tela")
  let input=app.textFields["Mensagem para a FluIA"]
  for e in [input,b("Enviar mensagem"),b("Fechar assistente")] {
   XCTAssertTrue(e.isHittable)
   XCTAssertGreaterThanOrEqual(e.frame.minY,0)
   XCTAssertLessThanOrEqual(e.frame.maxY,keyboard.frame.minY)
  }
  XCTAssertGreaterThanOrEqual(b("Enviar mensagem").frame.height,44)
  XCTAssertGreaterThanOrEqual(b("Fechar assistente").frame.height,44)
  print("FLUI79 GEOMETRIA teclado=\(keyboard.frame) input=\(input.frame) enviar=\(b("Enviar mensagem").frame) historico=\(app.scrollViews.containing(.staticText, identifier: "FluIA experimental · sugestões locais com dados demonstrativos, sem IA generativa ou disponibilidade em tempo real.").firstMatch.frame)")
 }
 @MainActor func testChatTeclado() {
  continueAfterFailure = false
  app.activate()
  if b("Fechar assistente").waitForExistence(timeout:2) { b("Fechar assistente").tap() }
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:45),app.debugDescription)
  b("Abrir assistente Flui IA").tap()
  XCTAssertTrue(b("Fechar assistente").waitForExistence(timeout:8))
  evidence("01-aberto-sem-teclado")
  b("Fechar assistente").tap()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:8))
  b("Abrir assistente Flui IA").tap()
  XCTAssertTrue(b("Fechar assistente").waitForExistence(timeout:8))
  let input=app.textFields["Mensagem para a FluIA"]
  let history=app.scrollViews.containing(.staticText, identifier: "FluIA experimental · sugestões locais com dados demonstrativos, sem IA generativa ou disponibilidade em tempo real.").firstMatch
  input.tap(); keyboardAndControls(); evidence("02-teclado-aberto")
  for c in "autonomia" { input.typeText(String(c)) }
  XCTAssertEqual(input.value as? String,"autonomia")
  b("Enviar mensagem").tap()
  let answer=app.staticTexts.matching(NSPredicate(format:"label BEGINSWITH %@","Autonomia é")).firstMatch
  XCTAssertTrue(answer.waitForExistence(timeout:8),app.debugDescription)
  keyboardAndControls()
  XCTAssertGreaterThan(history.frame.height,150)
  XCTAssertLessThanOrEqual(answer.frame.maxY,history.frame.maxY+1,"Fim da resposta deve ficar acima do campo")
  evidence("03-fim-resposta-com-teclado")
  for _ in 0..<4 {
   if answer.frame.minY >= history.frame.minY && answer.frame.minY < history.frame.maxY-40 {break}
   if answer.frame.minY < history.frame.minY {
    history.swipeDown()
   } else {
    history.coordinate(withNormalizedOffset: CGVector(dx:0.5,dy:0.7)).press(forDuration:0.05,thenDragTo:history.coordinate(withNormalizedOffset: CGVector(dx:0.5,dy:0.4)))
   }
  }
  XCTAssertGreaterThanOrEqual(answer.frame.minY,history.frame.minY-1)
  XCTAssertLessThan(answer.frame.minY,history.frame.maxY-40)
  keyboardAndControls(); evidence("04-inicio-resposta-por-rolagem")
  for _ in 0..<4 { if answer.frame.maxY <= history.frame.maxY+1 {break}; history.swipeUp() }
  XCTAssertLessThanOrEqual(answer.frame.maxY,history.frame.maxY+1)
  keyboardAndControls(); evidence("05-fim-resposta-por-rolagem")
  // O fechamento ocorre com o teclado virtual ainda visível.
  b("Fechar assistente").tap()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:8))
  XCTAssertLessThanOrEqual(b("Abrir assistente Flui IA").frame.width,52.5,"Botão deve retornar recolhido")
  XCTAssertFalse(b("Fechar assistente").exists)
  XCTAssertFalse(app.keyboards.firstMatch.exists)
  evidence("06-retorno-mapa")
  b("Abrir assistente Flui IA").tap()
  XCTAssertTrue(input.waitForExistence(timeout:8))
  XCTAssertEqual(input.value as? String,"Pergunte algo à FluIA")
  XCTAssertFalse(answer.exists,"Conversa deve ser limpa após fechar")
  evidence("07-reabertura-limpa")
  input.tap(); keyboardAndControls(); evidence("08-reabertura-teclado")
  b("Fechar assistente").tap()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:8))
  let search=app.textFields["Buscar no mapa"]
  search.tap()
  XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout:5))
  XCTAssertLessThan(app.keyboards.firstMatch.frame.minY,app.frame.height)
  b("Abrir assistente Flui IA").tap()
  XCTAssertTrue(b("Fechar assistente").waitForExistence(timeout:8))
  evidence("09-abertura-com-teclado-do-mapa")
  input.tap(); keyboardAndControls()
  b("Fechar assistente").tap()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:8))
  print("FLUI79 APROVADO teclado visível, envio, início/fim da resposta, fechar e reabrir")
 }
}
