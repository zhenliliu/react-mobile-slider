￼npm i react-mobile-slider
# react-mobile-slider

### 使用方法
```javascript
  import Slider from 'react-mobile-slider'

  export default class Component {
    setAnswer = (val) => {
      console.log(val)
    }
    render() {
      return (
          <Slider callback={this.setAnswer}
                  disable={disable}
                  unit='万'
                  maxNumber={1000}
                  minNumber={0}
          />
      )
    }
  }
  
```
![](https://github.com/zhenliliu/react-mobile-slider/blob/master/images/demo.gif)