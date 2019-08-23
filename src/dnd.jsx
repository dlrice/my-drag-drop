import React, { useRef, Component } from 'react'
import range from 'lodash.range';

const Item = ({ onMouseDown, style, className, children, id }) => {
  const ref = useRef();
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseDown={({ pageX, pageY, nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const { left, top } = ref.current.getBoundingClientRect();
        // console.log('left, top', left, top, 'offsetX, offsetY', offsetX, offsetY)
        onMouseDown([offsetX, offsetY], [pageX, pageY])
    }}>
      {children}
    </div>
  )
}

class DND extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mouse: [0, 0],
        lastPressed: [0, 0], // difference between mouse and item position, for dragging
        lastPress: null, // key of the last pressed component
        isPressed: false,
        items: [0, 1, 2], // index: visual position. value: component key/id
      };
      this.resizeTimeout = null;
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
      
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove({pageX, pageY}) {
        // console.log('mouse move', pageX, pageY)
        const { isPressed } = this.state;
        if (isPressed) {
            const mouse = [pageX, pageY];
            this.setState({ mouse });
        }
    }

    handleMouseDown(key, offsetXY, pageXY) {
        console.log('mouse down', key,  offsetXY, pageXY)
        this.setState({
            lastPress: key,
            isPressed: true,
            mouse: pageXY,
            lastPressed: [pageXY[0], pageXY[1]]
        });
    }

    handleMouseUp() {
        console.log('mouse up')
        this.setState({
            isPressed: false,
            lastPressed: [0, 0]
        });
    }

    render() {
        const { items, lastPress, isPressed, mouse: [x, y], lastPressed: [px, py] } = this.state;
        return (
            <div className="items">
                {items.map( (item, rowIndex) => {
                    // console.log(row)
                            let style,
                                visualPosition = items.indexOf(item),
                                isActive = (item === lastPress && isPressed);
                            if(isActive) {
                                const dx = x - px;
                                const dy = y - py;
                                style = {
                                    // position: 'absolute',
                                    transform: `translate3d(${dx}px, ${dy}px, 0)`,
                                };
                            }
                            const t = {
                                ...style,
                                zIndex: (item === lastPress ) ? 99 : visualPosition,
                            }
                            return (
                              <Item
                                key={item}
                                onMouseDown={(offsetXY, pageXY) => this.handleMouseDown(item, offsetXY, pageXY)}
                                className={isActive ? 'item is-active' : 'item'}
                                style={t}
                              >
                                Item {item + 1}
                              </Item>
                                    
                            )
                })}
            </div>
        )
    }
}

export default DND;