#!/usr/bin/env node

const puppeteer = require('puppeteer')
const repos = require('./repositories.json')
const yargs = require('yargs')

const args = yargs
  .option('email', { describe: 'email', demandOption: true })
  .option('password', { describe: 'password', demandOption: true })
  .option('token', { describe: '2FA token', demandOption: true })
  .option('old', { describe: 'old repo owner', demandOption: true })
  .option('new', { describe: 'new repo owner', demandOption: true })
  .help()
  .argv

function submit (name, owner) {
  document.querySelector('#facebox #confirm_new_owner').value = owner
  document.querySelector('#facebox #confirm_repository_name').value = name
  document.querySelector('#facebox #confirm_repository_name').blur()
  document.querySelector('#facebox button[type=submit]').disabled = false
}

async function main (options) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    // load login page
    await page.goto('https://github.com/login')

    // Username & Password
    await page.waitForSelector('#login_field')
    await page.focus('#login_field')
    await page.type(options.email)
    await page.focus('#password')
    await page.type(options.password)
    await page.click('.btn.btn-primary.btn-block')

    // 2FA Token
    await page.waitForSelector('#otp')
    await page.focus('#otp')
    await page.type(String(options.token))
    await page.click('.btn.btn-primary.btn-block')

    // Dashboard
    await page.waitForSelector('#dashboard')

    for (let repo of repos) {
      console.log(`processing: ${repo}`)
      await page.goto(`https://github.com/${options.old}/${repo}/settings`)
      await page.waitForSelector('.Box.Box--danger')

      // detect redirected url
      const url = await page.url()

      // skip and continue
      if (url !== `https://github.com/${options.old}/${repo}/settings`) {
        console.log(`skipping: ${repo}`)
        continue
      }

      await page.click('button[data-facebox="#transfer_confirm"]')
      await page.waitForSelector('#facebox .dangerzone')

      await page.waitFor(500)

      const name = repo.replace(`https://github.com/${options.old}/`, '')

      await page.evaluate(submit, name, options.new)

      await page.waitForSelector('#facebox button[type=submit]:not([disabled])')

      await page.click('.facebox-content.dangerzone button[type=submit]')

      await page.waitForNavigation()
    }
  } catch (err) {
    console.error(err.message)
  }

  await browser.close()
}

main(args)
