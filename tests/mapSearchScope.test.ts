import assert from "node:assert/strict";
import test from "node:test";
import { getMapSearchScope } from "../src/features/map/mapSearchScope";
import { cloneDefaultFilters } from "../src/utils/stationFilterParams";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { aplicarOrigemDemonstrativa } from "../src/utils/demonstracao";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
const catalog = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));
test("busca por cidade fora de 10 km não esvazia o mapa por um raio implícito",()=>{
 for(const city of ["Búzios","Rio de Janeiro","Cabo Frio"]){const filters=cloneDefaultFilters(),before=JSON.stringify(filters);const scope=getMapSearchScope(filters,city,false);assert.ok(filtrarEstacoes({estacoes:catalog,filtros:scope,termoBusca:city}).length>0,city);assert.equal(JSON.stringify(filters),before);}
});
test("distância escolhida explicitamente e outros filtros continuam sendo respeitados",()=>{
 const filters=cloneDefaultFilters();assert.strictEqual(getMapSearchScope(filters,"Búzios",true),filters);assert.equal(filtrarEstacoes({estacoes:catalog,filtros:getMapSearchScope(filters,"Búzios",true),termoBusca:"Búzios"}).length,0);
 filters.rating.minRating=4.5;assert.equal(filtrarEstacoes({estacoes:catalog,filtros:getMapSearchScope(filters,"Búzios",false),termoBusca:"Búzios"}).length,0);
});
test("sem busca textual o mapa volta ao raio normal com pontos perto da FIAP",()=>{
 const filters=cloneDefaultFilters();assert.strictEqual(getMapSearchScope(filters,"  ",false),filters);assert.ok(filtrarEstacoes({estacoes:catalog,filtros:filters}).length>0);
});
