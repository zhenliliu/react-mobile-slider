import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classname from 'classname'
import './index.scss'
export default class Index extends Component {

    static defaultProps = {
        maxNumber: 1000,
        minNumber: 0,
        selectedNumber: 0,
        callback: () => { console.warn('没有传递回调函数！')},
        unit: '单位',
        disable: false
    }

    constructor(props) {
        super(props)
        this.state = {
            left: 0,
            startX: 0,
            translateX: 0,
            currentX: 0,
            maxWidth: 0,
            sliderBarWidth: 0,
            maxNumber: props.maxNumber,
            minNumber: props.minNumber,
            numberPercent: 0,
            selectedNumber: props.selectedNumber,
            unit: props.unit,
            disable: props.disable
        }

        this.sliderBar = React.createRef();
        this.sliderRow= React.createRef();
    }

    setInitSelectedValue = () => {
        this.setState(({maxWidth, maxNumber, minNumber, sliderBarWidth, numberPercent, selectedNumber}) => {
            let currentX = (maxNumber - minNumber) / 2 / numberPercent
            return {
                currentX: currentX,
                selectedNumber: Math.floor(currentX * numberPercent)
            }
        },() => {
            this.changeSelectedAreaVerticalLineColor()
        })
    }

    renderVerticalLine = (number = 9) => {
        let arr = []
        for(let i = 0; i < number; i++){
            arr.push(<div key={i} className={classname('v_line', {'center_line': i === 4})}/>)
        }
        return arr
    }

    handlerTouchStart = (e) => {
        let { disable } = this.state
        if(disable) return
        e.preventDefault()

        this.setState(({currentX}) =>  {
            let startX = e.changedTouches[0].pageX
            return {
                startX: startX - currentX
            }
        })

    }

    handlerTouchEnd = (e) => {
        let { disable } = this.state
        if(disable) return
        e.preventDefault()
        let { selectedNumber } = this.state
        this.props.callback(selectedNumber)
    };

    handlerTouchMove = (e) => {
        let { disable } = this.state
        if(disable) return
        e.preventDefault()
        this.setState(({startX, maxWidth, sliderBarWidth, numberPercent, minNumber, maxNumber}) => {
            let translateX = e.changedTouches[0].pageX - startX;
            let selectedNumber = Math.floor(numberPercent * translateX) + minNumber
            if(translateX <= 0){
                translateX = -sliderBarWidth/ 2
                selectedNumber = minNumber
            }
            if(translateX >= maxWidth){
                translateX = maxWidth
                selectedNumber = maxNumber
            }
            return {
                currentX: translateX - sliderBarWidth / 2,
                selectedNumber:  selectedNumber
            }
        }, () => {
            this.changeSelectedAreaVerticalLineColor()
        })

    }

    changeSelectedAreaVerticalLineColor = () => {
        let { currentX } = this.state
        let NodeList = ReactDOM.findDOMNode(this.sliderRow.current).querySelectorAll('.v_line')
        for(let i = 0 , j = NodeList.length; i < j; i++){
            if(NodeList[i].offsetLeft <= currentX){
                NodeList[i].style.backgroundColor = '#fe9900'
            }else{
                NodeList[i].style.backgroundColor = '#ccc'
            }
        }
    }

    componentDidMount() {

        this.sliderBar.current.addEventListener('touchstart', this.handlerTouchStart, {passive: false})
        this.sliderBar.current.addEventListener('touchmove', this.handlerTouchMove, {passive: false})
        this.sliderBar.current.addEventListener('touchend', this.handlerTouchEnd, {passive: false})

        let sliderRow = this.sliderRow.current
        this.setState(({maxNumber, minNumber}) => ({
            maxWidth: sliderRow.clientWidth,
            sliderBarWidth: this.sliderBar.current.clientWidth,
            numberPercent: (maxNumber - minNumber) / sliderRow.clientWidth
        }),() => {
            this.setInitSelectedValue()

        })
    }

    render() {
        let { currentX, selectedNumber, minNumber, maxNumber,unit, disable } = this.state
        let translateString = `translate3D(${currentX}px, 0, 0)`
        let style = {
            MsTransform: translateString,
            MozTransform: translateString,
            OTransform: translateString,
            WebkitTransform: translateString,
            transform: translateString,
            visibility: disable ? "hidden" : 'auto'
        }
        let selectedColorStyle = {
            width: currentX + 2
        }
        return (
            <div className='slider_container'>
                <div className='selected_number_box'>
                    <div className='selected_number'>{selectedNumber}{unit}</div>
                    <div className='dashed_line'/>
                </div>
                <div className='num_box'>
                    <div className='min_number'>{minNumber}{unit}</div>
                    <div className='min_number'>{maxNumber}{unit}</div>
                </div>
                <div className='slider_row' ref={this.sliderRow}>
                    {this.renderVerticalLine()}
                    <div className='slider_bar' ref={this.sliderBar} style={style} >
                        <div className='bar_out_line'><div className='bar_in_line'/></div>
                    </div>
                    <div className='selected_color_box' style={selectedColorStyle}/>
                </div>

            </div>
        )
    }
}

Index.propTypes = {
    maxNumber: PropTypes.number.isRequired,
    minNumber: PropTypes.number.isRequired,
    selectedNumber: PropTypes.number.isRequired,
    callback: PropTypes.func.isRequired,
}
