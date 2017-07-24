const getUniqueSlug = (service, slug, count) => {
  return new Promise(resolve => {
    const testslug = count?slug+count:slug;

    // Test if we already have data with this slug
    service.find({
      query: {
        slug: testslug
      }
    }).then((result) => {
      if(result.data.length > 0) {
        count = count?count+1:1;
        resolve(getUniqueSlug(service, slug, count));
      } else {
        resolve(testslug);
      }
    });
  });
};

module.exports = getUniqueSlug;