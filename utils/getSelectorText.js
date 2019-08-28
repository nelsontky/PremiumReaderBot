module.exports = async (sel, page) => {
  await page.waitForSelector(sel);
  const element = await page.$(sel);
  return await page.evaluate(element => element.textContent, element);
};
