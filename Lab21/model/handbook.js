const fs = require('fs');
let data = require('./handbook.json') || [];

module.exports =
{
    getPhones: () => {
        console.log(data)
        return data
    },

    getPhoneById: id => data.find(phone => phone.id === Number(id)),

    addPhone(fields) {
        const { full_name, phonenumber } = fields;
        if (!full_name || !phonenumber) {
            throw new Error('Empty fio or number fields');
        }
        const newPhone =
        {
            id: nextId(),
            full_name,
            phonenumber
        };
        data.push(newPhone);
        save();
        return newPhone;
    },

    updatePhone(fields) {
        const { id, full_name, phonenumber } = fields;
        if (!id || !full_name || !phonenumber) {
            throw new Error('Empty id, fullName or phone fields');
        }
        let targetPhone = data.find(phone => phone.id === Number(id));
        if (!targetPhone) {
            throw new Error('Invalid record id');
        }
        targetPhone.full_name = full_name;
        targetPhone.phonenumber = phonenumber;
        save();
        return targetPhone;
    },

    deletePhone(fields) {
        const { id, full_name, phonenumber } = fields;
        let targetPhone = data.find(phone => phone.id == Number(id));
        if (!targetPhone) {
            throw new Error('Invalid record id');
        }
        data = data.filter(phone => phone.id !== Number(id));
        save();
        return targetPhone;
    }
}

function nextId() {
    return data[data.length - 1].id + 1
}
function save() {
    fs.writeFile(__dirname + '/handbook.json', JSON.stringify(data, null, '  '), err => {
        if (err) {
            throw err;
        }
    });
}