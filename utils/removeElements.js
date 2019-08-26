module.exports.removeOne = async (sel, page) => {
  try {
    await page.evaluate(sel => {
      let element = document.querySelector(sel);
      element.parentNode.removeChild(element);
    }, sel);
  } catch {
    // if sel not found just continue execution
  }
};

module.exports.removeAll = async (sel, page) => {
  await page.evaluate(sel => {
    let elements = document.querySelectorAll(sel);
    for (let i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, sel);
};
