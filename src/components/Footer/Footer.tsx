import { Copyright } from "../Copyright/Copyright"
import { SubscriptionForm } from "../SubscriptionForm/SubscriptionForm"
import { SocialLinks } from "../SocialLinks/SocialLinks"
import { MenuItems } from "../MenuItems/MenuItems"

export const Footer = () => {
  return (
    <footer className="bg-footer-bg">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between py-10 px-2 gap-2">
          <div className="flex flex-col gap-8 min-w-86">
            <SubscriptionForm></SubscriptionForm>
            <SocialLinks></SocialLinks>
          </div>
          <MenuItems></MenuItems>
        </div>
        <Copyright></Copyright>
      </div>
    </footer>
  )
}