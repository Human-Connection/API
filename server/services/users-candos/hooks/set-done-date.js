// Set done date, when cando is done
module.exports = () => hook => {
  if (!hook.data.done) {
    hook.data.doneAt = null;
  } else if (!hook.data.doneAt) {
    hook.data.doneAt = Date.now();
  }
  return hook;
};
