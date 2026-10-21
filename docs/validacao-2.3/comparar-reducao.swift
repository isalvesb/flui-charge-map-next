import AppKit
let paths=Array(CommandLine.arguments.dropFirst())
let frames=paths.map { NSBitmapImageRep(data:try! Data(contentsOf:URL(fileURLWithPath:$0)))! }
let first=frames[0]
print("Capturas \(first.pixelsWide)x\(first.pixelsHigh), \(first.samplesPerPixel) canais")
for n in 1..<frames.count {
 let other=frames[n]; var difference=0
 for y in 390..<535 { for x in 55..<200 { for channel in 0..<first.samplesPerPixel {
  let a=first.bitmapData![y*first.bytesPerRow+x*first.samplesPerPixel+channel]
  let b=other.bitmapData![y*other.bytesPerRow+x*other.samplesPerPixel+channel]
  if a != b { difference += 1 }
 } } }
 print("Orb ROI x55..199/y390..534, captura1 vs captura\(n+1): \(difference) canais diferentes")
 if difference != 0 { exit(1) }
}
