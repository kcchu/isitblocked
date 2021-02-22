import { FunctionalComponent, h } from 'preact'
import { Link } from 'preact-router/match'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  notfound: {
    padding: "0 5%",
    margin: "100px 0"
  }
}))

const Notfound: FunctionalComponent = () => {
  const style = useStyles()
  return (
    <div class={style.notfound}>
      <h1>Error 404</h1>
      <p>That page doesn&apos;t exist.</p>
      <Link href="/">
        <h4>Back to Home</h4>
      </Link>
    </div>
  )
}

export default Notfound
