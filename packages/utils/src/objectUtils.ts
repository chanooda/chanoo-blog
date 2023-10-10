export const objetEmptyFilter = (object: any) => {
  const copyObject = Object.assign(object, {});
  Object.keys(copyObject).forEach((key) => {
    if (!copyObject[key]) {
      delete copyObject[key];
    }
  });

  return copyObject;
};
