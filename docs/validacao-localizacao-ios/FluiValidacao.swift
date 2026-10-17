import XCTest
import Darwin
final class FluiValidacao: XCTestCase {
 let app=XCUIApplication(bundleIdentifier:"host.exp.Exponent")
 let safari=XCUIApplication(bundleIdentifier:"com.apple.mobilesafari")
 func b(_ label:String)->XCUIElement {app.buttons.matching(NSPredicate(format:label == "Iniciar rota" ? "label BEGINSWITH %@" : "label == %@",label)).firstMatch}
 func text(_ prefix:String)->XCUIElement {app.staticTexts.matching(NSPredicate(format:"label BEGINSWITH %@",prefix)).firstMatch}
 func evidence(_ name:String,_ target:XCUIApplication?=nil) {
  let target=target ?? app;print("FLUI75 \(name)\n\(target.debugDescription)");fflush(stdout)
  let a=XCTAttachment(screenshot:target.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)
 }
 func startRoute() {
  app.activate();XCTAssertTrue(b("Iniciar rota").waitForExistence(timeout:45),app.debugDescription)
  b("Iniciar rota").tap();XCTAssertTrue(b("Continuar").waitForExistence(timeout:8));XCTAssertTrue(b("Cancelar").exists);b("Continuar").tap()
 }
 @MainActor func testGPSIndisponivel() {
  continueAfterFailure=false;startRoute()
  XCTAssertTrue(b("Tentar novamente").waitForExistence(timeout:25),app.debugDescription)
  XCTAssertTrue(text("Não foi possível obter sua localização agora.").exists)
  XCTAssertTrue(b("Continuar sem localização").isHittable)
  XCTAssertTrue(b("Cancelar").isHittable)
  XCTAssertFalse(b("Abrir Google Maps").exists)
  evidence("01-gps-indisponivel-recuperavel")
 }
 @MainActor func testPosicaoDisponivelEMapas() {
  continueAfterFailure=false;app.activate()
  if b("Cancelar").exists {b("Cancelar").tap()}
  startRoute()
  XCTAssertTrue(b("Abrir Google Maps").waitForExistence(timeout:22),app.debugDescription)
  XCTAssertFalse(text("Sem localização compartilhada.").exists)
  evidence("02-posicao-disponivel-provedores")
  b("Abrir Google Maps").tap()
  XCTAssertTrue(safari.wait(for:.runningForeground,timeout:20),app.debugDescription)
  evidence("03-google-maps-aberto",safari)
  app.activate();XCTAssertTrue(b("Abrir Waze").waitForExistence(timeout:8))
  b("Abrir Waze").tap()
  XCTAssertTrue(safari.wait(for:.runningForeground,timeout:20))
  evidence("04-waze-aberto",safari)
  app.activate();b("Cancelar").tap();XCTAssertTrue(b("Iniciar rota").waitForExistence(timeout:8))
  b("Iniciar rota").tap();XCTAssertTrue(b("Continuar").waitForExistence(timeout:8))
  evidence("05-nova-rota-solicita-posicao-atual")
  b("Cancelar").tap()
 }
 @MainActor func testPermissaoNegadaEFallback() {
  continueAfterFailure=false;startRoute()
  XCTAssertTrue(b("Tentar novamente").waitForExistence(timeout:15),app.debugDescription)
  XCTAssertTrue(text("Acesso à localização não permitido.").exists)
  evidence("06-permissao-negada-recuperavel")
  b("Continuar sem localização").tap()
  XCTAssertTrue(b("Abrir Google Maps").waitForExistence(timeout:8))
  XCTAssertTrue(text("Sem localização compartilhada.").exists)
  evidence("07-escolha-explicita-sem-origem")
  b("Abrir Google Maps").tap()
  XCTAssertTrue(safari.wait(for:.runningForeground,timeout:20))
  evidence("08-google-sem-origem",safari)
  app.activate();b("Cancelar").tap()
 }
}
