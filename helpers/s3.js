const aws = require('aws-sdk')
const fs = require('fs')

//------passing credentials to AWS-----------------//

const s3 = new aws.S3({
  accessKeyId: 'AKIA2LEM2G4762JTNKI3',
  secretAccessKey: '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'
})

exports.upload = (req, res, next) => {
  const { file } = req
  if (!file) {
    console.log('Multer failed :(')
    return res.sendStatus(500)
  }

  const { filename, mimetype, size, path } = req.file
  s3.putObject({
    Bucket: 'eternia',
    ACL: 'public-read',
    Key: filename,
    Body: fs.createReadStream(path),
    ContentType: mimetype,
    ContentLength: size
  })
    .promise()
    .then((info) => {
      console.log(info)
      next()
    })
    .catch((err) => {
      console.log('Error', err)
      res.sendStatus(500)
    })
    .then(() => fs.unlink(path, () => {}))
}
