import XCTest
import Darwin
final class FluiValidacao: XCTestCase {
 let app=XCUIApplication(bundleIdentifier:"host.exp.Exponent")
 func b(_ label:String)->XCUIElement {app.buttons.matching(NSPredicate(format:"label == %@",label)).firstMatch}
 func verify(_ name:String) {
  let assistant=b("Abrir assistente Flui IA")
  for control in [b("Aumentar zoom do mapa"),b("Diminuir zoom do mapa"),app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@","Centralizar origem demonstrativa:")).firstMatch] {
   XCTAssertTrue(control.isHittable)
   XCTAssertFalse(assistant.frame.intersects(control.frame),"FluIA \(assistant.frame) sobrepõe \(control.frame)")
   print("FLUI79 CONTROLES \(name) FluIA=\(assistant.frame) controle=\(control.frame)")
  }
  XCTAssertTrue(assistant.isHittable)
  print("FLUI79 \(name)\n\(app.debugDescription)");fflush(stdout)
  let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)
 }
 @MainActor func testRetornoMapaSemSobreposicao() {
  continueAfterFailure=false;app.activate()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:30),app.debugDescription)
  verify("mapa-controles-separados")
  b("Abrir assistente Flui IA").tap()
  XCTAssertTrue(b("Fechar assistente").waitForExistence(timeout:8))
  b("Fechar assistente").tap()
  XCTAssertTrue(b("Abrir assistente Flui IA").waitForExistence(timeout:8))
  verify("retorno-mapa-controles-separados")
 }
}
