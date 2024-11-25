import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react"

export function Navigation() {
  return (
    <Navbar maxWidth="xl"    className="bg-gradient-to-r from-blue-500 to-purple-500 border-b  border-gray" position="static">
      <NavbarBrand>
        <Link href="/" >
          <p className="font-bold text-2xl text-white">CampusRecruit</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex " justify="center">
        <div className="flex">
          <NavbarItem>
            <Link href="/"  className="text-white hover:text-gray-200 gap-10 p-20 transition-colors text-lg">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/skills"  className="text-white hover:text-black transition-colors text-lg">
              Skills
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/jobs"  className="text-white hover:text-black  transition-colors text-lg">
              Jobs
            </Link>
          </NavbarItem>
        </div>
        <NavbarItem>
          <Button color="default" variant="flat" className="bg-white text-blue-500 hover:bg-black font-bold py-2 px-4 rounded">
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}