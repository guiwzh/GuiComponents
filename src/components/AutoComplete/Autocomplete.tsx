import React, {FC,useState,ChangeEvent ,ReactElement, useEffect, useRef} from 'react'
import Input,{InputProps} from '../Input/input'
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
import useClickOutside from '../../hooks/useClickOutside';
export interface DataSourceType {
    value: string;
    [key: string]: any;
  }
// export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompletProps extends Omit<InputProps,'onSelect' | 'onChange'> {
    fetchSuggestions: (string: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) => void;
    onChange?: (str:string) => void;
    onEnterDown?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
    debounceTime?: number;
    expireTime?: number;
}

export const AutoComplete: FC<AutoCompletProps> = (props) => {
    const {value,fetchSuggestions,onSelect,onChange,onEnterDown,renderOption,style,debounceTime=300,expireTime=3600000,...restprops} = props;

    const [inputValue,setInputValue] = useState(value as string);
    const [suggestions,setSuggestions] = useState<DataSourceType[]>([]);
    const [loading, setloading] = useState(false);
    const [highlightIndex,sethighlightIndex]= useState(-1);
    const [isFocus,setisFocus] = useState(true);

    const componentRef = useRef<HTMLDivElement>(null);//获取组件的Dom节点
    const triggerSearch = useRef(false);//解决select后，再次触发fetchsuggestion的问题
    const fetchId = useRef(0);//解决竞态问题
    const intialInputvalue = useRef(value as string);//记录当前输入框不是通过Arraydown与Arrayup方法改变时的值
    const debouncedValue = useDebounce(inputValue,debounceTime);//使用该hooks，将inputValue的值进行防抖处理
    useClickOutside(componentRef,()=>{setisFocus(false)});//使用该hooks，使得点击组件外部时，将suggestions清空
    useEffect(()=>{
        function getData(){
            
            async function fetchData(){
                fetchId.current++;
                if(debouncedValue){
                    const Id=fetchId.current;
                    setloading(true)
                    setSuggestions([])
                    try{
                        const results = await fetchSuggestions(debouncedValue);
                        
                        if( Id === fetchId.current && results){
                            setloading(false)
                            setSuggestions(results)
                            const item = {
                                value: results,  // 实际数据
                                expiry: new Date().getTime() + expireTime, // 当前时间加上1小时的过期时间 (单位毫秒)
                            };
                            localStorage.setItem(debouncedValue, JSON.stringify(item))
                        }
                    }catch (e){
                        alert(e)
                        setloading(false)
                        setSuggestions([])
                    }
                }else{
                    setloading(false)
                    setSuggestions([])
                }
            }
            if (triggerSearch.current){
                
                if(localStorage.getItem(debouncedValue)){
                    const item = JSON.parse(localStorage.getItem(debouncedValue) as string);
                    if(item.expiry > new Date().getTime()){
                        fetchId.current++;
                        setloading(false)
                        setSuggestions(item.value)
                    }else{
                        localStorage.removeItem(debouncedValue)
                        fetchData()
                    }
                }else{
                    fetchData()
                }
                sethighlightIndex(-1)
            }
        }
        getData()
        
    },[debouncedValue])

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value.trim();
        setInputValue(value)
        onChange?.(value)
          
        intialInputvalue.current=value
        triggerSearch.current=true
    };

    const handleSelect = (item:DataSourceType) => {
        setInputValue(item.value)
        intialInputvalue.current=item.value
        setSuggestions([]);
        onSelect?.(item);
        
        triggerSearch.current=false
    }
    const handleUpDown = (item:DataSourceType) => {
        setInputValue(item.value)
        triggerSearch.current=false
    }
    const handleArrowDown = () => {
        if(highlightIndex+1>suggestions.length-1){
            sethighlightIndex(-1)
            
            setInputValue(intialInputvalue.current);
            triggerSearch.current=false
            
        }else{
            sethighlightIndex(highlightIndex+1)
            if(suggestions[highlightIndex+1])handleUpDown(suggestions[highlightIndex+1])
        }
    }
    const handleArrowUp = () => {
        if(highlightIndex-1===-1){
            sethighlightIndex(highlightIndex-1)
            setInputValue(intialInputvalue.current);
            triggerSearch.current=false
        }else if(highlightIndex-1<-1){
            sethighlightIndex(suggestions.length-1)
            if(suggestions[suggestions.length-1])handleUpDown(suggestions[suggestions.length-1])
        }else{
            sethighlightIndex(highlightIndex-1)
            handleUpDown(suggestions[highlightIndex-1])
        }
    }
    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
         switch(e.key){
            case 'Enter':
                if (suggestions[highlightIndex]){
                    handleSelect(suggestions[highlightIndex])
                    onEnterDown?.(suggestions[highlightIndex])
                }else{
                    onEnterDown?.({value:intialInputvalue.current})
                }
                break
            case 'ArrowDown':
                handleArrowDown()
                break
            case 'ArrowUp':
                handleArrowUp()
                break
            case 'Escape':
                setisFocus(false)
                break
            default:
                break
         }
    }
    const handleClick = (e:any) => {
        setisFocus(true)
    }
    const generateDropdown = () => {
        return (
            <ul className="viking-suggestion-list">
                {suggestions.map((item,index)=>{
                    const cnames= classNames('suggestion-item',{
                        'item-highlighted':index===highlightIndex
                    })
                    return (
                        <li key={index} 
                            onClick={()=>handleSelect(item)}
                            className={cnames}
                        >
                        {renderOption ? renderOption(item) : item.value}
                        </li>
                    )
                }
                )}
            </ul>
        )
    };
    return (
        <div className='viking-auto-complete' style={style} ref={componentRef}>
            <Input 
                value={inputValue} 
                onChange={handleChange}
                {...restprops}
                onKeyDown={handleKeyDown} 
                onClick={handleClick}
            />
            {isFocus && loading && <ul><Icon icon="spinner" spin></Icon>loading...</ul>}
            {isFocus && suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete