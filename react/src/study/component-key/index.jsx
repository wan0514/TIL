import Good from './Good'
import Wrong from './Wrong'

export default function ComponentKey() {
    return <div style={{display: "flex", gap: 30}}>
        <Good/>
        <Wrong/>
    </div>
}