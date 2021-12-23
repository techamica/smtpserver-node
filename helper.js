const fs = require('fs'),
    path = require('path'),
    FormData = require('form-data')

const file_exists = file_path => {
    let exists = false,
        size = 0

    if(fs.existsSync(file_path)){
        let stats = fs.lstatSync(file_path)

        if(stats.isFile()) {
            exists = true
            size = stats.size
        }
    }
    
    return { exists, size }
}

const attach_files = file_list => {
    const form = new FormData()

    file_list.forEach((v, k) => form.append(`productImage_${ k }`, fs.createReadStream(v), path.basename(v)))
    
    return form
}

module.exports = { file_exists, attach_files }