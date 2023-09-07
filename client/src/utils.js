export function filterVehicleObj(obj) {
  const filteredObj = {
    engineDisplacement: obj.engineDisplacement,
    weight: obj.weight,
    rpmRedLine: obj.rpmRedLine,
    model: obj.model,
    manufacturer: obj.manufacturer
  };

  return filteredObj;
}