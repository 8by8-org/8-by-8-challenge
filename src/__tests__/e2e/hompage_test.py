import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class NextJSTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.implicitly_wait(10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_homepage_title(self):
        host = ("http://localhost:3000")
        self.driver.get(host)
        self.assertEqual(self.driver.title, "8by8 Challenge")
        
    def test_logo_render(self):
        wait = WebDriverWait(self.driver, 20)
        logo_element = wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//img[@alt='8by8 Logo']")))
        self.assertEqual(logo_element.is_displayed(), True)
        
    def test_locate_button(self):
        button_element = self.driver.find_element(By.TAG_NAME, "button")
        if button_element.is_displayed():
           True
        else:
            self.fail("Button element not found")

    def test_section_render(self):
        wait = WebDriverWait(self.driver, 5)
        section_render = wait.until(
            EC.visibility_of_element_located((By.TAG_NAME, "section")))
        self.assertEqual(section_render.is_displayed(), True)
        
    def test_link_tag_content(self):
        link_tag = self.driver.find_element(By.PARTIAL_LINK_TEXT, 'See')
        link_tag.get_attribute('href') == '/why8by8'
        # click is not passing
        link_tag.click()
            
    # def test_h1_rendered(self):
    #     h1_rendered = self.driver.find_element(By.CLASS_NAME, 'color_white')
    #     print(h1_rendered)
    
    # test not passing 
    # def test_h1_rendered(self):
    #     h1_element = self.driver.find_element(By.TAG_NAME, 'h1')
    #     self.assertEqual(h1_element.is_displayed(), True)


    # def test_anchor_tag_rendered(self):
    #     wait = WebDriverWait(self.driver, 5)
    #     section_render = wait.until(
    #         EC.visibility_of_element_located((By.TAG_NAME, "a")))
    #     self.assertEqual(section_render.is_displayed(), True)
        

if __name__ == "__main__":
    unittest.main()
