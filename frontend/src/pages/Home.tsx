import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"

const Home = () => {
  return (
    <div className="mt-4 px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activities</h1>
          <p className="text-muted-foreground">Manage your activities here.</p>
        </div>
        <ActivityForm />
      </div>
      <ActivityList />
    </div>
  )
}

export default Home
