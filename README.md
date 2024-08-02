# 这里是一套个人开发的React组件库

技术栈：React18+Typescript+SCSS

## `Button组件`

* 页面中最常用的的按钮元素，适合于完成特定的交互，支持HTML中button和a链接的所有属性
* props包含size，btnType,href等属性
* 如果设置btnType为link，则原生标签为<a></a>,并将其href设置为props传入的href

## `Icon组件`

* 提供了一套常用的图标集合基于react-fontawesome组件库
* 支持react-fontawesome的所有属性 可以在这里查询 https://github.com/FortAwesome/react-fontawesome#basic
* 支持fontawesome所有free-solid-icons，可以在这里查看所有图标 https://fontawesome.com/icons?d=gallery&s=solid&m=free
* props包含theme及组件本身的属性，可根据theme设置图标为对应的主题颜色
  
## `Input组件`

* Input输入框通过鼠标或键盘输入内容，是最基础的表单域的包装
* props包含prepend,append,icon,size等与input标签原生属性
* icon属性添加图标，在输入框右侧悬浮添加一个图标，用于提示
* prepend与append添加输入框的前缀与后缀

## `Menu组件`

* 为网站提供导航功能的菜单。支持横向与纵向两种显示模式，支持下拉菜单
* Menu组件将对children进行检查，只可包含MenuItem与SubMenu两种children
* subMenu为下拉菜单，支持下拉菜单的嵌套使用，同样对children进行检查
* props包含defaultIndex,defaultOpenSubMenus,onSelect,size,mode等属性
* 通过defaultIndex设置默认active的菜单项的索引值index，mode设置菜单类型为横向或者纵向，defaultOpenSubMenus设置子菜单的默认打开，只在纵向模式下生效
* onSelect设置的回调函数，入参除开react点击事件对象，还包含此时对应的组件的索引值index，例如1-2-1

## `Autocomplete组件`

* 实现了类似于百度主页的搜索框功能，组件展示内容包含输入框以及在下面显示的搜索建议列表，支持Input组件的所有属性，支持键盘事件选择
* props包含fetchSuggestions，onSelect,onChange,onEnterDown,renderOption,debounceTime,expireTime等props
* fetchSuggestions传入当输入框内容改变时所调用的获取搜索建议的函数，支持异步的返回结果，当结果未返回时，输入框下方将显示spinner图标表示加载中，其返回结果应该是一个对象数组，对象中需要包含value属性，搜索建议列表默认显示value
* 通过renderOption,可自行定义搜索建议列表每项的展示内容
* 通过自定义hooks，利用useEffect与setTimeout实现了输入框内容改变时，调用fetchSuggestions的回调函数的防抖，可通过debounceTime属性自行设置防抖时间，默认为300ms
* 通过useRef与fetchId解决了获取搜索建议的竞态问题，使得无论异步返回结果的先后顺序如何，展示的搜索建议列表均为输入框中最后的停留值所对应的搜索建议
* 仿照百度，通过localStroage实现了搜索建议列表的缓存。当对应输入框值的搜索建议获取成功后，会将结果存储到localStroage中，并为其设置相应的失效时间。下次输入框为相同值时，若搜索建议未过期，则直接获取缓存结果。可通过,expireTime自行设置过期时间，默认为1hour
* 仿照百度，通过自定义hooks，实现了当点击组件外的网页内容以及按下ESC键时，搜索建议列表会被隐藏
* 仿照百度，可通过键盘的上下箭头，实现搜索建议列表选中项的上下循环移动与高亮展示，且会将搜索建议列表中的选中项回填到输入框中。当选中项为搜索建议列表的第一个或最后一个时，继续往上移动或往下移动时，则又会重新将输入框的原始value回填到输入框中
* onEnterDown的传入函数为按下Enter键时调用，onSelect的传入函数为点击搜索建议列表中的某一项时调用,onChange的传入函数为输入框内容改变时调用，未防抖

## `UpLoad组件`

* 实现了通过点击或者拖拽上传文件，并对上传文件列表的进度与状态进行动态展示得功能；当props属性包含drag时，其上传方式为拖曳到组件区域上传，默认为点击Button按钮上传
* 文件上传利用axios库的post请求实现，'Content-Type'设置为'multipart/form-data'，form-data的key可通过props中的name设定，value为对应的单个文件。
* 对原始文件进行了包裹，赋予其更多有用信息，包裹后的文件对象包含uid,size,name,status,percent,raw等字段，文件上传时的钩子函数所获取的为包裹后的文件对象，
* props包含beforeUpload, onprogress, onSuccess, onError等钩子函数，分别在文件上传前，上传中，上传成功以及上传失败后进行调用。
* props包含headers,data,withCredentials,accept,multiple,maxsize,maxnum等属性，可对文件上传时的请求头，额外的上传数据，是否携带cookie,接受的文件类型，是否支持多文件上传，文件的最大大小以及数量进行设定。
* 实现了通过宽度变化的进度条以及/文件上传百分比与对应文件名对不同文件上传的进度进行动态展示，进度条的右侧图标根据文件对象的上传的三种状态而动态改变，当鼠标移动到进度条上时，图标会变为叉号。
* 通过useRef与axios中的cancelToken实现了点击对应文件的叉号图标可以取消该文件的上传的功能。
