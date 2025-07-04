'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function ModalDadosObrigatorios({ aberto, aoFechar, aoConfirmar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [alertaAberto, setAlertaAberto] = useState(false);

  function handleConfirmar() {
    if (!nome || !email || !cpfCnpj || !telefone) {
      setAlertaAberto(true);
      return;
    }

    aoConfirmar({ nome, email, cpfCnpj, telefone });
    aoFechar();
  }

  function formatarCpfCnpj(valor) {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numeros
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    }
  }

  function formatarTelefone(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  }

  return (
    <>
      <Dialog open={aberto} onOpenChange={aoFechar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bora gerar seu Pix? Só preencher aqui:</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
            <Input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input
              placeholder="CPF ou CNPJ"
              value={cpfCnpj}
              onChange={e => setCpfCnpj(formatarCpfCnpj(e.target.value))}
            />
            <Input
              placeholder="Telefone"
              value={telefone}
              onChange={e => setTelefone(formatarTelefone(e.target.value))}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={aoFechar}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmar}>Ir para pagamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertaAberto} onOpenChange={setAlertaAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Campos obrigatórios</AlertDialogTitle>
            <p>Por favor, preencha todos os campos antes de continuar.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaAberto(false)}>Fechar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
