/**
 * 
 * @description include required packages
 * @global true
 * @package fs
 * @package path
 * @package form-data
 */
const fs = require('fs'),
    path = require('path'),
    FormData = require('form-data')

/**
 * 
 * @function file_exists
 * @description Checks if a file exists
 * @param { file_path: MANDATORY }
 * @returns Object { exists, size }
 */
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

/**
 * 
 * @function attach_files
 * @description Attaches files to POST form
 * @param { file_list: MANDATORY }
 * @returns form
 */
const attach_files = file_list => {
    const form = new FormData()

    file_list.forEach((v, k) => form.append(`productImage_${ k }`, fs.createReadStream(v), path.basename(v)))
    
    return form
}

/**
 * 
 * @exports file_exists
 * @exports attach_files
 */
module.exports = { file_exists, attach_files }