import styles from './styles.module.css'

const ItemSearch = ({ items, onClick }) => {
  return <div className={styles.container}>
    {items.map(({ title, id, price_retail, image, description }) => {
      return <div key={id} onClick={_ => onClick({ id, title, price_retail, image, description })}>{title}</div>
    })}
  </div>
}

export default ItemSearch