import {Component} from 'react'
import Navbar from '../Navbar'
import TabItem from '../TabItem'
import ImageItem from '../ImageItem'
import WinOrLoose from '../WinOrLoose'
import './index.css'

class EmojiGame extends Component {
  constructor(props) {
    super(props)
    const {imagesList, tabsList} = this.props
    this.state = {
      isGameStarted: true,
      topScore: 0,
      time: 60,
      activeTabId: tabsList[0].tabId,
      showedImage: imagesList[0],
    }
  }

  componentDidMount() {
    this.timerId = setInterval(this.time, 1000)
  }

  componentWillUnmount() {
    this.clearIntervalId()
  }

  clearIntervalId = () => clearInterval(this.timerId)

  time = () => {
    const {time} = this.state
    if (time === 0) {
      this.clearIntervalId()
      this.setState(prev => ({isGameStarted: !prev.isGameStarted}))
      this.setState({time: 60})
    } else {
      this.setState(prev => ({time: prev.time - 1}))
    }
  }

  stateChange = () => {
    const {imagesList} = this.props
    this.setState(prev => ({isGameStarted: !prev.isGameStarted}))
    this.setState({topScore: 0, time: 60, showedImage: imagesList[0]})
    this.componentDidMount()
  }

  winOrLoosCard = () => {
    const {topScore} = this.state
    return <WinOrLoose score={topScore} againGame={this.stateChange} />
  }

  imageTab = cate => {
    const {showedImage} = this.state
    const {imagesList} = this.props
    const {id} = showedImage

    if (id === cate) {
      this.setState(prev => ({topScore: prev.topScore + 1}))
      this.setState({
        showedImage: imagesList[Math.floor(Math.random() * imagesList.length)],
      })
    } else {
      this.setState(prev => ({isGameStarted: !prev.isGameStarted}))
    }
  }

  filterList = () => {
    const {activeTabId} = this.state
    const {imagesList} = this.props
    const filterImages = imagesList.filter(
      each => each.category === activeTabId,
    )
    return filterImages
  }

  onTabId = tabId => {
    this.setState({
      activeTabId: tabId,
    })
  }

  renderOfImagesList = () => {
    const {tabsList} = this.props
    const {showedImage, activeTabId} = this.state
    const {imageUrl} = showedImage
    const filterList = this.filterList()

    return (
      <div className="main-image">
        <img src={imageUrl} alt="match" className="image-url" />
        <ul className="tab-container">
          {tabsList.map(each => (
            <TabItem
              key={each.tabId}
              tab={each}
              onTabId={this.onTabId}
              isActive={activeTabId === each.tabId}
            />
          ))}
        </ul>
        <ul className="images-list">
          {filterList.map(each => (
            <ImageItem
              imageItem={each}
              key={each.id}
              imageTab={this.imageTab}
            />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {imagesList, tabsList} = this.props
    const {isGameStarted, topScore, time} = this.state
    return (
      <div className="app-container">
        <ul>
          <li>
            <Navbar topScore={topScore} timeRemaining={time} />
          </li>
        </ul>
        <div className="images-card">
          {isGameStarted ? this.renderOfImagesList() : this.winOrLoosCard()}
        </div>
      </div>
    )
  }
}

export default EmojiGame
