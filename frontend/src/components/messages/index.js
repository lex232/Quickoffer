import styles from './styles.module.css'

const SimpleDivMessage = ({ text }) => {
  return <div className={styles.container}>
    Ошибка: {text}
  </div>
}

export default SimpleDivMessage