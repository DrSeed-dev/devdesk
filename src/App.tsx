import Card from "./components/ui/Card";

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase text-sky-600">
            Developer Productivity Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold">DevDesk</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            A focused dashboard for your daily developer workflow.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Clock">
            <p>Live clock widget will go here.</p>
          </Card>

          <Card title="Weather">
            <p>Weather widget will go here.</p>
          </Card>

          <Card title="Todos">
            <p>Todo list widget will go here.</p>
          </Card>

          <Card title="Notes">
            <p>Sticky notes widget will go here.</p>
          </Card>

          <Card title="GitHub">
            <p>GitHub profile widget will go here.</p>
          </Card>

          <Card title="Quote">
            <p>Programming quote widget will go here.</p>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default App;