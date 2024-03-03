import {
  Outlet,
  Link,
  NavLink,
  Form,
  useLoaderData,
  useNavigation,
  redirect
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useState, useEffect } from "react";

export async function loader({ request }) {
  console.log(request)
  const url = new URL(request.url)
  
  console.log(url)
  const q = url.searchParams.get("q") || ""
  const contacts = await getContacts(q)
  return { contacts, q }
}

export async function action() {
  const contact = await createContact()
  console.log(contact)
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function Root() {
  const { contacts, q } = useLoaderData()
  console.log(q)
  const [ query, setQuery ] = useState(q)
  const navigation = useNavigation()

  useEffect(() => {
    setQuery(q)
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
            />
            <div id="search-spinner" aria-hidden hidden={true}></div>
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  )
}
