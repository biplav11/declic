import pb, { getFullRequest } from "./pocketbase";

export async function getBodyTypes() {
  return await getFullRequest("body_types", "position");
}
export async function getSliders() {
  return await getFullRequest("sliders", "position");
}

export async function getBrands(number = 20, page = 1) {
  const brands = await pb.collection("brands").getList(page, number, {
    sort: "name",
    requestKey: null,
  });
  return brands.items;
}

export async function getDealers() {
  const dealers = await pb.collection("users").getFullList({
    sort: "-created",
    filter: 'role="dealership"',
    expand: "brands",
    requestKey: null,
  });
  const dealership = await pb.collection("dealership").getFullList({
    sort: "-created",
    expand: "brands",
    requestKey: null,
  });

  let res = dealers.map((dealer) => {
    let i = dealership.findIndex((e) => e.user_id === dealer.id);
    // let { brands } = dealers[i].expand;
    return {
      ...dealer,
      brands: [],
    };
  });

  return res;
}

export async function getSellers() {
  const sellers = await pb.collection("users").getFullList({
    filter: 'role = "seller"',
    requestKey: null,
    sort: "-created",
  });

  return sellers;
}

export async function getUser(id) {
  // const record = await pb.collection('users').getFirstListItem(`id="${id}"`, {
  //     requestKey: null
  // });
  const record = await pb.collection("users").getOne(id, { requestKey: null });
  return record;
}

export async function getNewsCategory() {
  const newsCategory = await pb.collection("news_categories").getFullList({
    requestKey: null,
    sort: "position",
  });
  return newsCategory;
}

export async function getAddresses(id) {
  const addresses = await pb.collection("dealership_address").getFullList({
    filter: `user_id="${id}"`,
    requestKey: null,
  });
  return addresses;
}

export async function getCategory(slug) {
  const category = await pb.collection("news_categories").getFirstListItem(`slug="${slug}"`, {});
  return category;
}

export async function getPages() {
  const pages = await pb.collection("pages").getFullList({
    filter: "published = true",
    requestKey: null,
    sort: "-created",
  });

  return pages;
}

export async function getSinglePage(slug) {
  const pages = pb.collection("pages").getFirstListItem(`slug="${slug}"`, {
    requestKey: "null",
  });

  return pages;
}

export async function getLatestModels(limit = 8) {
  const res = await pb.collection("models").getList(1, limit, {
    sort: "-created",
    expand: "brand, body_types",
    requestKey: null,
  });
  return res.items;
}

export async function getAllModels() {
  return await pb.collection("models").getFullList({
    sort: "name",
    expand: "brand",
    requestKey: null,
  });
}
