'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Hammer } from 'lucide-react';
import LandingFooter from '@/components/landing/LandingFooter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import LandingHeader from '@/components/landing/LandingHeader';

export default function TelaLogin() {
  const [abaSelecionada, setAbaSelecionada] = useState('first-access');
  const [emailPrimeiroAcesso, setEmailPrimeiroAcesso] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-petLight via-white to-petPurple/10 dark:from-background dark:via-background dark:to-background flex flex-col">
      <LandingHeader />

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Button
          variant="ghost"
          asChild
          className="absolute top-4 left-4 text-petGray dark:text-gray-300 hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <Card className="w-full max-w-md shadow-xl border-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-petPurple to-petBlue bg-clip-text text-transparent">
              Acesse sua PetPage
            </CardTitle>
            <CardDescription className="text-petGray dark:text-gray-300">
              Escolha uma opção abaixo para ter acesso
              <br />a página do seu pet:
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={abaSelecionada} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="first-access"
                  onClick={() => setAbaSelecionada('first-access')}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-petPurple data-[state=active]:to-petBlue data-[state=active]:text-white font-semibold"
                >
                  🌟 Primeiro Acesso
                </TabsTrigger>
                <TabsTrigger value="login" onClick={() => setAbaSelecionada('login')}>
                  Entrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="first-access" className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-petPurple/10 to-petBlue/10 rounded-lg border border-petPurple/20">
                  <h3 className="font-semibold text-petPurple mb-2">Novo por aqui?</h3>
                  <p className="text-sm text-petGray">
                    Insira seu e-mail e receba um link seguro para configurar sua conta.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-access-email" className="flex items-center gap-2 text-petGray">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </Label>
                    <Input
                      id="first-access-email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={emailPrimeiroAcesso}
                      onChange={e => setEmailPrimeiroAcesso(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 h-11 rounded-lg"
                    onClick={() => setMostrarModal(true)}
                  >
                    Receber Link de Acesso
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-petGray">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-petGray">
                      <Lock className="w-4 h-4" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={mostrarSenha ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={loginForm.password}
                        onChange={e =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        className="rounded-lg pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? (
                          <EyeOff className="w-4 h-4 text-petGray" />
                        ) : (
                          <Eye className="w-4 h-4 text-petGray" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginForm.rememberMe}
                        onCheckedChange={v => setLoginForm({ ...loginForm, rememberMe: !!v })}
                      />
                      <Label htmlFor="remember" className="text-sm text-petGray">
                        Lembrar de mim
                      </Label>
                    </div>
                    <Button variant="link" className="px-0 text-sm text-petPurple hover:text-petPurple/80">
                      Esqueci a senha
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90 h-11 rounded-lg"
                    onClick={() => setMostrarModal(true)}
                  >
                    Entrar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-petGray dark:text-gray-400">
              Ainda não tem conta? Use a opção{' '}
              <Button
                variant="link"
                className="px-0 text-petPurple hover:text-petPurple/80"
                onClick={() => setAbaSelecionada('first-access')}
              >
                Primeiro Acesso
              </Button>
              .
            </p>
          </CardFooter>
        </Card>

        {/* Modal de Sucesso */}
        <Dialog open={mostrarModal} onOpenChange={setMostrarModal}>
          <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader className="text-center flex flex-col items-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <Hammer className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <DialogTitle className="text-xl font-semibold dark:text-white">Funcionalidade em Construção</DialogTitle>
              <DialogDescription className="text-center dark:text-gray-300">
                Estamos implementando esta funcionalidade e em breve ela estará disponível.
                <br />
                Quando estiver pronta, avisaremos nas nossas redes sociais e comunicações.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setMostrarModal(false)}
                className="bg-gradient-to-r from-petPurple to-petBlue hover:from-petPurple/90 hover:to-petBlue/90"
              >
                Entendi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <LandingFooter />
    </div>
  );
}
