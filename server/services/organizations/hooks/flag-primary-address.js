// Add flag on primary address
const alterItems = require('../../../helper/alter-items');

module.exports = () => alterItems(handleItem);

const handleItem = item => {
  if (item.addresses && item.addresses[item.primaryAddressIndex]) {
    item.addresses.map((address, index) => {
      address.primary = index === item.primaryAddressIndex;
      return address;
    });
  }
  return item;
};