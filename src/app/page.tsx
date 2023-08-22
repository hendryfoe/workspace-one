import Image from 'next/image';

import { Navbar } from '@/components/navbar';

import styles from '../styles/root.module.css';

export default async function Page() {
  return (
    <div className="w-full h-screen">
      <Navbar />

      <main>
        <div className="w-full bg-gray-800">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
            <div className="text-center pb-12">
              <h2 className="text-base font-bold text-indigo-600">We have the best equipment in the market</h2>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-white">
                Check our awesome team membwhite
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Dany Bailey</p>
                  <p className="text-base text-gray-400 font-normal">Software Engineer</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Lucy Carter</p>
                  <p className="text-base text-gray-400 font-normal">Graphic Designer</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Jade Bradley</p>
                  <p className="text-base text-gray-400 font-normal">Dev Ops</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Dany Bailey</p>
                  <p className="text-base text-gray-400 font-normal">Software Engineer</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Lucy Carter</p>
                  <p className="text-base text-gray-400 font-normal">Graphic Designer</p>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center items-center">
                <div>
                  <img
                    className="object-center object-cover h-auto w-full"
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80"
                    alt="photo"
                  />
                </div>
                <div className="text-center py-8 sm:py-6">
                  <p className="text-xl text-white font-bold mb-2">Jade Bradley</p>
                  <p className="text-base text-gray-400 font-normal">Dev Ops</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
