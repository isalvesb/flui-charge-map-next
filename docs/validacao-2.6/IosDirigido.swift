import XCTest
import Darwin
final class FluiValidacao: XCTestCase {
 let app=XCUIApplication(bundleIdentifier:"host.exp.Exponent")
 func b(_ name:String)->XCUIElement { app.buttons.matching(NSPredicate(format:"label == %@",name)).firstMatch }
 func evidence(_ name:String) { print("BETA26 \(name)\n\(app.debugDescription)");fflush(stdout);let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a) }
 func reveal(_ element:XCUIElement) {for _ in 0..<4 {if element.isHittable {return};app.scrollViews.firstMatch.swipeUp()};XCTAssertTrue(element.isHittable,app.debugDescription)}
 @MainActor func testTextoAmpliadoMapaEPaineis() {
  continueAfterFailure=false;app.activate();XCTAssertTrue(b("Abrir busca e filtros").waitForExistence(timeout:45),app.debugDescription)
  for label in ["Abrir perfil","Abrir busca e filtros","Mostrar atalhos de filtro","Aumentar zoom do mapa","Diminuir zoom do mapa","Abrir assistente Flui IA","Minimizar opções demonstrativas para ver o mapa inteiro"] {
   let e=b(label);XCTAssertTrue(e.exists,label);XCTAssertGreaterThanOrEqual(e.frame.width,44,label);XCTAssertGreaterThanOrEqual(e.frame.height,44,label);XCTAssertTrue(e.isHittable,label);print("BETA26 TOQUE \(label) \(e.frame)")
  }
  XCTAssertFalse(b("Abrir assistente Flui IA").frame.intersects(b("Aumentar zoom do mapa").frame), "FluIA sobrepõe zoom")
  XCTAssertFalse(b("Abrir assistente Flui IA").frame.intersects(b("Diminuir zoom do mapa").frame), "FluIA sobrepõe zoom")
  evidence("ios-texto-ampliado-mapa")
  b("Minimizar opções demonstrativas para ver o mapa inteiro").tap();XCTAssertTrue(b("Mostrar opções demonstrativas").waitForExistence(timeout:8));
  XCTAssertFalse(app.buttons.matching(NSPredicate(format:"label CONTAINS %@",". Opção demonstrativa.")).firstMatch.exists)
  b("Mostrar opções demonstrativas").tap();XCTAssertTrue(b("Minimizar opções demonstrativas para ver o mapa inteiro").waitForExistence(timeout:8))
  app.buttons.matching(NSPredicate(format:"label CONTAINS %@","Bateria para estimativa:")).firstMatch.tap()
  XCTAssertTrue(b("Fechar sem definir a carga").waitForExistence(timeout:8));XCTAssertGreaterThanOrEqual(b("Fechar sem definir a carga").frame.height,44)
  evidence("ios-bateria-texto-ampliado")
  reveal(b("Definir carga da bateria"));evidence("ios-bateria-acao-alcancavel")
  for _ in 0..<4 {if b("Fechar sem definir a carga").isHittable {break};app.scrollViews.firstMatch.swipeDown()}
  b("Fechar sem definir a carga").tap();XCTAssertTrue(b("Abrir busca e filtros").waitForExistence(timeout:8))
  b("Abrir assistente Flui IA").tap();XCTAssertTrue(b("Fechar assistente").waitForExistence(timeout:8))
  reveal(b("Quero esperar com conforto"));evidence("ios-fluia-opcoes-alcancaveis")
  b("Fechar assistente").tap();XCTAssertTrue(b("Abrir busca e filtros").waitForExistence(timeout:8))
  print("BETA26 APROVADO texto ampliado, toque, painel oculto e modais; sem editar preferências")
 }
}
