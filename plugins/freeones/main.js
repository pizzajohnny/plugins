module.exports = async ({
  $createImage,
  args,
  $axios,
  $moment,
  $cheerio,
  $throw,
  $log,
  actorName,
}) => {
  if (!actorName)
    $throw("Uh oh. You shouldn't use the plugin for this type of event");

  $log(
    `Scraping freeones date for ${actorName}, dry mode: ${args.dry || false}...`
  );

  const blacklist = args.blacklist || [];
  if (!args.blacklist) $log("No blacklist defined, returning everything...");
  
  //Check imperial unit preference
  const imp_pref = args.useImperial;
  if (!imp_pref) {
	  $log("Imperial preference not set. Using metric values...");
  } else {
	  $log("Imperial preference indicated. Using imperial values...");
  }
  
  /* const petiteThreshold = parseInt(args.petiteThreshold) || 160; */

  const url = `https://freeones.xxx/${actorName.replace(/ /g, "-")}/profile`;
  let html;
  try {
    html = (await $axios.get(url)).data;
  } catch (e) {
    $throw("Error fetching url: " + e.message);
  }

  const $ = $cheerio.load(html);

  function getNationality() {
    if (blacklist.includes("nationality")) return {};
    $log("Getting nationality...");

    const elements = $(
      '[data-test="section-personal-information"] a[href*="countryCode%5D"]'
    );

    if (!elements.length) {
      $log("Nationality not found");
      return {};
    }

    const nationality = $(elements).attr("href").split("=").slice(-1)[0];
    if (!nationality) {
      return {};
    }
    return {
      nationality,
    };
  }

  function getHeight() {
    if (blacklist.includes("height")) return {};
    $log("Getting height...");

    const htsel = $('[data-test="link_height"] .text-underline-always');
    if (!htsel) return {};

    const rawht = $(htsel).text();
    const ht_cm = rawht.match(/\d+cm/)[0];
    if (!ht_cm) return {};
	let hgt = parseInt(ht_cm.replace("cm", ""));
	if (!imp_pref) return { Height: hgt };
	hgt *= 0.033;
	hgt = Math.round((hgt + Number.EPSILON) * 100) / 100;
	return { height: hgt };
  }
  
  function getWeight() {
    if (blacklist.includes("weight")) return {};
    $log("Getting weight...");

    const wtsel = $('[data-test="link_weight"] .text-underline-always');
    if (!wtsel) return {};

    const rawwt = $(wtsel).text();
    const wt_kg = rawwt.match(/\d+kg/)[0];
    if (!wt_kg) return {};
	let wgt = parseInt(wt_kg.replace("kg", ""));
	if (!imp_pref) return { Weight: wgt };
	wgt *= 2.2;
	wgt = Math.round((wgt + Number.EPSILON) * 100) / 100;
	return { weight: wgt };
  }

  function scrapeText(prop, selector) {
    if (blacklist.includes(prop)) return {};
    $log(`Getting ${prop}...`);

    const el = $(selector);
    if (!el) return {};

    return { [prop]: el.text() };
  }

  async function getAvatar() {
    if (args.dry) return {};
    if (blacklist.includes("avatar")) return {};
    $log("Getting avatar...");

    const imgEl = $(".profile-header .img-fluid");
    if (!imgEl) return {};

    const url = $(imgEl).attr("src");
    const imgId = await $createImage(url, `${actorName} (avatar)`);

    return { avatar: imgId };
  }

  function getAge() {
    if (blacklist.includes("bornOn")) return {};
    $log("Getting age...");

    const aTag = $('[data-test="section-personal-information"] a');
    if (!aTag) return {};

    const href = $(aTag).attr("href");
    const yyyymmdd = href.match(/\d\d\d\d-\d\d-\d\d/);

    if (yyyymmdd && yyyymmdd.length) {
      const date = yyyymmdd[0];
      const timestamp = $moment(date, "YYYY-MM-DD").valueOf();
      return {
        bornOn: timestamp,
      };
    } else {
      $log("Could not find actor birth date.");
      return {};
    }
  }
  
  function getAlias() {
    if (blacklist.includes("aliases")) return {};
    $log("Getting aliases...");

    const alias_sel = $('[data-test="section-alias"] p[data-test*="p_aliases"]');
	const alias_text = alias_sel.text();
	const alias_name = alias_text && !/unknown/.test(alias_text) ? alias_text.trim() : null;
	if (!alias_name) return {};
	const alias_fin = alias_name.split(/,\s*/g);
	
	return { aliases: alias_fin };
  }

  const custom = {
    ...scrapeText(
      "hairColor",
      '[data-test="link_hair_color"] .text-underline-always'
    ),
    ...scrapeText(
      "eyeColor",
      '[data-test="link_eye_color"] .text-underline-always'
    ),
    ...scrapeText(
      "ethnicity",
      '[data-test="link_ethnicity"] .text-underline-always'
    ),
    ...getHeight(),
	...getWeight(),
  };

  const data = {
    ...getNationality(),
    ...getAge(),
	...getAlias(),
    ...(await getAvatar()),
    custom,
  };

  if (!blacklist.includes("labels")) {
    data.labels = [];
    if (custom.hairColor) data.labels.push(`${custom.hairColor} Hair`);
    if (custom.eyeColor) data.labels.push(`${custom.eyeColor} Eyes`);
    if (custom.ethnicity) data.labels.push(custom.ethnicity);
    /* if (custom.height && custom.height <= petiteThreshold)
      data.labels.push("Petite"); */
  }

  if (args.dry === true) {
    $log("Would have returned:", data);
    return {};
  }
  return data;
};
