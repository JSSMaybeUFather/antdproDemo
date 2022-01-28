import moment from 'moment';
//后端传来的赋给form的数据进行格式化
export const setFieldsAdaptor = (data: BasicListApi.PageData) => {
    const newData = {};
    if (data.dataSource) {
        Object.keys(data.dataSource).forEach((fieldName) => {
            const type =
                data.layout.tabs[0].data.find((item) => {
                    return item.key === fieldName;
                })?.type || '';
            switch (type) {
                case 'datetime':
                    newData[fieldName] = moment(data.dataSource[fieldName]);
                    break;
                default:
                    newData[fieldName] = data.dataSource[fieldName];
                    break;
            }
        });
    }
    return newData;
};

export const submitFieldsAdaptor = (formValues: any) => {
    const result = {};
    for (const key in formValues) {
        if (formValues[key]?._isAMomentObject) {
            result[key] = moment(formValues[key]).format();
        } else {
            result[key] = formValues[key];
        }
    }
    return result;
};
