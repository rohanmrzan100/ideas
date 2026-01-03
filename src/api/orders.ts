export async function getCities() {
  try {
    const response = await fetch(
      'http://localhost:8000/api/v1/delivery/pathao/city-list'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getZones(city_id: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/delivery/pathao/zone-list/${city_id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getAreas(zone_id: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/delivery/pathao/area-list/${zone_id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
