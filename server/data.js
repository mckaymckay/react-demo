// 示例任务列表数据
export const taskList = [
    { id: 1, title: '吃饭', completed: false },
    { id: 2, title: '睡觉', completed: false },
    { id: 3, title: '写代码', completed: true },
];


// 懒加载图片示例
export const imageList = [
    { id: 1, title: '示例图片', images: ['../src/assets/img1.jpeg'] },
    { id: 2, title: '示例图片2', images: ['../src/assets/img2.jpeg'] },
    { id: 3, title: '示例图片3', images: ['../src/assets/img3.jpeg'] },
    { id: 4, title: '示例图片4', images: ['../src/assets/img4.jpeg'] },
    { id: 5, title: '示例图片5', images: ['../src/assets/img5.jpeg'] },
    { id: 6, title: '示例图片6', images: ['../src/assets/img6.jpeg'] },
    { id: 7, title: '示例图片7', images: ['../src/assets/img7.jpeg'] },
    { id: 8, title: '示例图片8', images: ['../src/assets/img8.jpeg'] },
    { id: 9, title: '示例图片9', images: ['../src/assets/img9.jpeg'] },
    { id: 10, title: '示例图片10', images: ['../src/assets/img10.jpeg'] },
    { id: 11, title: '示例图片11', images: ['../src/assets/img11.jpeg'] },
    { id: 12, title: '示例图片12', images: ['../src/assets/img12.jpeg'] },
    { id: 13, title: '示例图片13', images: ['../src/assets/img13.jpeg'] },
    { id: 14, title: '示例图片14', images: ['../src/assets/img14.jpeg'] },
    { id: 15, title: '示例图片15', images: ['../src/assets/img15.jpeg'] },
    { id: 16, title: '示例图片16', images: ['../src/assets/img16.jpeg'] },
    { id: 17, title: '示例图片17', images: ['../src/assets/img17.jpeg'] },
    { id: 18, title: '示例图片18', images: ['../src/assets/img18.jpeg'] },
    { id: 19, title: '示例图片19', images: ['../src/assets/img19.jpeg'] },
    { id: 20, title: '示例图片20', images: ['../src/assets/img20.jpeg'] },
    { id: 21, title: '示例图片21', images: ['../src/assets/img21.jpeg'] },
    { id: 22, title: '示例图片22', images: ['../src/assets/img22.jpeg'] },
    { id: 23, title: '示例图片23', images: ['../src/assets/img23.jpeg'] },
    { id: 24, title: '示例图片24', images: ['../src/assets/img24.jpeg'] },
    { id: 25, title: '示例图片25', images: ['../src/assets/img25.jpeg'] },
    { id: 26, title: '示例图片26', images: ['../src/assets/img26.jpeg'] },
    { id: 27, title: '示例图片27', images: ['../src/assets/img27.jpeg'] },
    { id: 28, title: '示例图片28', images: ['../src/assets/img28.jpeg'] },
    { id: 29, title: '示例图片29', images: ['../src/assets/img29.jpeg'] },
    { id: 30, title: '示例图片30', images: ['../src/assets/img30.jpeg'] }
]

// 长表单渲染示例
// routes/form-config.js
export const formConfig = {
    sections: [
        {
            title: '基本信息',
            fields: [
                { key: 'name', label: '姓名', type: 'input', required: true },
                { key: 'email', label: '邮箱', type: 'input', required: true },
                { key: 'phone', label: '电话', type: 'input', required: false },
                {
                    key: 'gender', label: '性别', type: 'select', required: true, options: [
                        { label: '男', value: 'male' },
                        { label: '女', value: 'female' }
                    ]
                },
                { key: 'birthday', label: '生日', type: 'date', required: false },
            ]
        },
        {
            title: '工作信息',
            fields: [
                { key: 'company', label: '公司名称', type: 'input', required: true },
                { key: 'position', label: '职位', type: 'input', required: true },
                { key: 'salary', label: '薪资', type: 'number', required: false },
                {
                    key: 'workYears', label: '工作年限', type: 'select', required: true, options: [
                        { label: '1年以下', value: '0-1' },
                        { label: '1-3年', value: '1-3' },
                        { label: '3-5年', value: '3-5' },
                        { label: '5年以上', value: '5+' }
                    ]
                },
                { key: 'skills', label: '技能', type: 'textarea', required: false },
            ]
        },
        {
            title: '教育背景',
            fields: [
                {
                    key: 'education', label: '学历', type: 'select', required: true, options: [
                        { label: '高中', value: 'high_school' },
                        { label: '大专', value: 'college' },
                        { label: '本科', value: 'bachelor' },
                        { label: '硕士', value: 'master' },
                        { label: '博士', value: 'doctor' }
                    ]
                },
                { key: 'school', label: '学校', type: 'input', required: true },
                { key: 'major', label: '专业', type: 'input', required: true },
                { key: 'graduationYear', label: '毕业年份', type: 'date', required: true },
            ]
        },
        {
            title: '联系信息',
            fields: [
                { key: 'address', label: '地址', type: 'textarea', required: false },
                { key: 'emergencyContact', label: '紧急联系人', type: 'input', required: true },
                { key: 'emergencyPhone', label: '紧急联系人电话', type: 'input', required: true },
                { key: 'wechat', label: '微信号', type: 'input', required: false },
                { key: 'qq', label: 'QQ号', type: 'input', required: false },
            ]
        },
        {
            title: '其他信息',
            fields: [
                { key: 'hobbies', label: '兴趣爱好', type: 'textarea', required: false },
                { key: 'selfIntroduction', label: '自我介绍', type: 'textarea', required: false },
                { key: 'remarks', label: '备注', type: 'textarea', required: false },
            ]
        }
    ]
};

export const formDetail = {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13812345678',
    gender: 'male',
    birthday: '1990-01-01',
    company: '阿里巴巴',
    position: '前端工程师',
    salary: 25000,
    workYears: '3-5',
    skills: 'React, Vue, Node.js, TypeScript',
    education: 'bachelor',
    school: '清华大学',
    major: '计算机科学与技术',
    graduationYear: '2015-07-01',
    address: '北京市海淀区中关村',
    emergencyContact: '李四',
    emergencyPhone: '13987654321',
    wechat: 'zhangsan_wx',
    qq: '123456789',
    hobbies: '编程、阅读、运动',
    selfIntroduction: '我是一名热爱技术的前端工程师...',
    remarks: '无'
};
