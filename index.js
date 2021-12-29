/**
 * 
 * @name index.js
 * @description Official API library for smtpserver.com
 * @author Techamica <is@woano.com>
 * @copyright 2021 Techamica
 * @license MIT
 * @version 1.1.2
 * @link https://github.com/techamica/smtpserver-node
 */

/**
 * 
 * @description include required packages & libraries
 * @global true
 * @package email-validator
 * @package path
 * @package axios
 * @module manifest
 * @module helper
 */
const validator = require("email-validator"),
    path = require('path'),
    axios = require('axios'),
    { api_key_length, max_upload_size } = require(path.resolve(__dirname, 'manifest')),
    { file_exists, attach_files } = require(path.resolve(__dirname, 'helper'))

/**
 * 
 * @class SmtpApiMailer
 * @description Class for setting & sending mail
 */
class SmtpApiMailer {
    /**
     * 
     * @description Declare all private data-members
     * @private
     */
    #target_url = "https://api.smtpserver.com/mailer/send"
    #timeout = 20
    #api_key = null
    #to = {}
    #from = null
    #from_name = ''
    #header = {}
    #subject = null
    #body = { text: null, html: null }
    #total_size = 0
    #files = []
    #mail_data = {}

    /**
     * 
     * @constructor
     * @description Initiates class Object
     * @param { api_key: MANDATORY }
     * @public
     */
    constructor(api_key) {
        this.#api_key = api_key
    }

    /**
     * 
     * @method setTimeout
     * @description Set timeout in sec
     * @param { timeout: MANDATORY }
     * @public
     * @returns this
     */
    setTimeout(timeout) {
        this.#timeout = timeout>120 ? 120 : timeout

        return this
    }

    /**
     * 
     * @method setTo
     * @description Set To emails
     * @param { to_list: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    setTo(to_list) {
        if(typeof to_list==='object' && !Array.isArray(to_list) && to_list!==null && to_list!==undefined) {
            if(Object.getPrototypeOf(to_list).length===0)
                throw new Error("To doesn't contain a single Email")
            else {
                for(let i in to_list) {
                    if(typeof i === 'string' || i instanceof String) {
                        if(validator.validate(i.trim())) {
                            if(typeof to_list[i] === 'string' || to_list[i] instanceof String)
                                this.#to[i.trim()] = to_list[i].trim()
                            else
                                throw new Error(`One or more email names is/are not proper string`)
                        }
                        else
                            throw new Error(`${ i } is not a proper email`)
                    }
                    else
                        throw new Error(`One or more email(s) is/are not proper string`)
                }
            }
        }
        else if(Array.isArray(to_list)) {
            if(to_list.length===0)
                throw new Error("To doesn't contain a single Email")
            else {
                to_list.forEach(v => {
                    if(typeof v === 'string' || v instanceof String) {
                        if(validator.validate(v))
                            this.#to[v] = ''
                        else
                            throw new Error(`${ v } is not a proper email`)
                    }
                    else
                        throw new Error(`One or more email(s) is/are not proper string`)
                })
            }
        }
        else if(typeof to_list === 'string' || to_list instanceof String) {
            if(validator.validate(to_list))
                this.#to[to_list] = ''
            else
                throw new Error(`${ to_list } is not a proper email`)
        }
        else
            throw new Error("To must be an Email or array of Emails or object of Emails & Names")
    
        return this
    }

    /**
     * 
     * @method setFrom
     * @description Set From email
     * @param { from_mail: MANDATORY }
     * @param { from_name: OPTIONAL }
     * @public
     * @returns this
     * @throws ERROR
     */
    setFrom(from_mail, from_name='') {
        if(typeof from_mail === 'string' || from_mail instanceof String) {
            if(validator.validate(from_mail))
                this.#from = from_mail

            if(typeof from_name === 'string' || from_name instanceof String)
                this.#from_name = from_name.trim()
            else
                throw new Error("From name must be a string")
        }
        else
            throw new Error("From mail must be a string containing a proper Email")

        return this
    }

    /**
     * 
     * @method setHeader
     * @description Set custom headers
     * @param { header_list: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    setHeader(header_list) {
        if(typeof header_list==='object' && !Array.isArray(header_list) && header_list!==null && header_list!==undefined) {
            if(Object.getPrototypeOf(header_list).length===0)
                throw new Error("Header doesn't contain a single data")
            else {
                for(let i in header_list) {
                    if(typeof i === 'string' || i instanceof String) {
                        if(i.trim()!=='') {
                            if(typeof header_list[i] === 'string' || header_list[i] instanceof String) {
                                if(header_list[i].trim()!=='')
                                    this.#header[i.trim()] = header_list[i].trim()
                                else
                                    throw new Error(`Header ${ i } has empty value or just whitespaces`)
                            }
                            else
                                throw new Error(`Header ${ i } value is not string`)
                        }
                        else
                            throw new Error(`Header ${ i } is empty or just whitespaces`)
                    }
                    else
                        throw new Error(`Header ${ i } is not string`)
                }
            }
        }
        else
            throw new Error("Header must be an object of Header names & data")

        return this
    }

    /**
     * 
     * @method setSubject
     * @description Set subject
     * @param { subject: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    setSubject(subject) {
        if(typeof subject === 'string' || subject instanceof String) {
            if(subject.trim()!=='')
                this.#subject = subject.trim()
            else
                throw new Error("Subject cannot be empty string or whitespaces")
        }
        else
            throw new Error("Subject must be a proper string")

        return this
    }

    /**
     * 
     * @method setText
     * @description Set text
     * @param { text: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    setText(text) {
        if(typeof text === 'string' || text instanceof String) {
            if(text.trim()!=='')
                this.#body.text = text.trim()
            else
                throw new Error("Text cannot be empty string or whitespaces")
        }
        else
            throw new Error("Text must be a proper string")

        return this
    }

    /**
     * 
     * @method setHtml
     * @description Set html
     * @param { html: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    setHtml(html) {
        if(typeof html === 'string' || html instanceof String) {
            if(html.trim()!=='')
                this.#body.html = html.trim()
            else
                throw new Error("HTML cannot be empty string or whitespaces")
        }
        else
            throw new Error("HTML must be a proper string")

        return this
    }

    /**
     * 
     * @method addFile
     * @description Attach local files
     * @param { addFile: MANDATORY }
     * @public
     * @returns this
     * @throws ERROR
     */
    addFile(file_list) {
        if(Array.isArray(file_list)) {
            if(file_list.length===0)
                throw new Error("File list doesn't contain a single file path")
            else {
                file_list.forEach(v => {
                    if(typeof v === 'string' || v instanceof String) {
                        const { exists, size } = file_exists(v)

                        if(exists) {
                            this.#total_size += size
                            this.#files.push(v)
                        }
                        else
                            throw new Error(`${ v } doesn't exist`)
                    }
                    else
                        throw new Error("One or more file path(s) is/are not proper string")
                })
            }
        }
        else if(typeof file_list === 'string' || file_list instanceof String) {
            const { exists, size } = file_exists(file_list)

            if(exists){
                this.#total_size += size
                this.#files.push(file_list)
            }
            else
                throw new Error(`${ file_list } doesn't exist`)
        }
        else
            throw new Error("File must be a single file path or array of files with absolute path")

        return this
    }

    /**
     * 
     * @method #prepare
     * @description Prepare mail sending for API
     * @private
     * @returns this
     * @throws ERROR
     */
    #prepare() {
        /* S T A R T: check if API KEY is valid */
        if(this.#api_key===null)
            throw new Error("API KEY must be a proper string")
        else if(typeof this.#api_key === 'string' || this.#api_key instanceof String) {
            this.#api_key = this.#api_key.trim()

            if(this.#api_key==='')
                throw new Error("API KEY cannot be empty or whitespaces")
            else if(this.#api_key.length!==api_key_length)
                throw new Error("API KEY is invalid")
        }
        else
            throw new Error("API KEY must be a proper string")
        /* E N D: check if API KEY is valid */

        // validate if to mails exist
        if(Object.getOwnPropertyNames(this.#to).length===0)
            throw new Error("A To email must be set in order to send mail")
        else
            this.#mail_data['to'] = JSON.stringify(this.#to)

        // validate from mail
        if(this.#from===null)
            throw new Error("A From email must be set in order to send mail")
        else
            this.#mail_data['from'] = this.#from

        // set from name
        if(this.#from_name!=='')
            this.#mail_data['from_name'] = this.#from_name

        // set headers
        if(Object.getOwnPropertyNames(this.#header).length!==0)
            this.#mail_data['headers'] = JSON.stringify(this.#header)

        // set subject
        if(this.#subject!==null)
            this.#mail_data['subject'] = this.#subject

        /* S T A R T: check if a valid Text/HTML was provided */
        if(this.#body.text===null && this.#body.html===null)
            throw new Error("Either of Text & HTML is mandatory")
        else {
            if(this.#body.text!==null)
                this.#mail_data['text'] = this.#body.text
            if(this.#body.html!==null)
                this.#mail_data['html'] = this.#body.html
        }
        /* E N D: check if a valid Text/HTML was provided */

        if(this.#total_size>max_upload_size)
            throw new Error(`Maximum upload size of ${ max_upload_size } Bytes exceeded`)

        return this
    }

    /**
     * 
     * @method #send
     * @description Push mail via API
     * @private
     * @returns Promise
     */
    #send() {
        const form = attach_files(this.#files)

        for(let i in this.#mail_data) {
            form.append(i, this.#mail_data[i])
        }

        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    method: 'post',
                    url: this.#target_url,
                    timeout: this.#timeout*1000,
                    data: form,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    headers: {
                        ...form.getHeaders(),
                        ...this.#header,
                        'Content-Type': 'multipart/form-data',
                        'App-Key': this.#api_key
                    }
                })

                // resolve(Object.getOwnPropertyNames(response))
                resolve({ code: response.status, headers: response.headers, ...response.data })
            }
            catch(e) {
                reject(e)
            }
        })
        .catch(err => {
            if(Object.getOwnPropertyNames(err).includes('toJSON'))
                return { code: err.response.status, headers: err.response.headers, ...err.response.data }
            else
                return { code: 500, headers: {}, success: 0, message: err }
        })
    }

    /**
     * 
     * @method sendMail
     * @description Prepare & send mail 
     * @public
     * @returns Promise
     */
    sendMail() {
        return this.#prepare().#send()
    }
}

/**
 * 
 * @exports SmtpApiMailer
 */
module.exports = SmtpApiMailer
