//routing                   /api/v1/bootcamps
//method                     GET
//access                     public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'get all bootcamps' });
};
//routing                   /api/v1/bootcamp/:id
//method                     GET
//access                     public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
};
//routing                   /api/v1/bootcamps
//method                     POST
// access                          private

exports.createBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'create bootcamps' });
};
//routing                   /api/v1/bootcamps/:id
//method                     PUT
//access                     private

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `update bootcamp ${req.params.id}` });
};

//routing                   /api/v1/bootcamps
//method                     DELETE
//access                     private

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}` });
};
