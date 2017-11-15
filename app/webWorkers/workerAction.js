export default action => ({
  ...action,
  meta: {
    WebWorker: true, // This line specifies that the worker should show up and do the job
  },
});
