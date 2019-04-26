abstract class BaseController {

  abstract model: any;

  /**
   * Function to get all records from the collection.
   *
   * @memberof BaseController
   */
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  /**
   * Function to get count of all records from the collection.
   *
   * @memberof BaseController
   */
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  /**
   *Function to save the record in the collection.
   *
   * @memberof BaseController
   */
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {

      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        return res.status(400).json({ error: true, sucess: false, data: { errors: { path: 'email', message: 'User is already registered' } } });
      }
      if (err) {

        if (err.errors) {
          let cstmErrors = {};
          let errs = err.errors;
          Object.keys(errs).forEach(function (key) {
            cstmErrors[key] = { path: errs[key].path, message: errs[key].message };
          });
          return res.status(400).json({ error: true, sucess: false, data: { errors: cstmErrors } });
        }
        return res.status(400).json(err);
      }

      res.status(200).json(item);
    });
  }

  /**
   *Function to get the single record from the collection by record id
   *
   * @memberof BaseController
   */
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   *Function to update collection record.
   *
   * @memberof BaseController
   */
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  /**
   *Function to delete collection record.
   *
   * @memberof BaseController
   */
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  /**
   *Function to filter the response.
   *
   * @memberof BaseController
   */
  filterResponse = (status: Boolean, statusCode: Number, message: String, data: any) => {

    return { status: { isSuccessful: status, code: statusCode, message: message }, data: data };
  }
}

export default BaseController;
